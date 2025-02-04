/* eslint-disable sonarjs/no-hardcoded-passwords */
import crypto from 'node:crypto';

import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util.js';
import { plainToClass } from 'class-transformer';
import ms from 'ms';

import { RoleType } from '../../common/constants/role-type.ts';
import { IFile } from '../../common/interfaces/IFile.ts';
import { HelperEncryptionService } from '../../shared/helper/services/helper-encryption.service.ts';
import { HelperHashService } from '../../shared/helper/services/helper-hash.service.ts';
import { MailService } from '../../shared/mail/mail.service.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { Reference } from '../../types.ts';
import { Session } from '../session/domain/session.ts';
import { SessionService } from '../session/session.service.ts';
import { CreateSettingsDto } from '../user/dtos/create-settings.dto.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto.ts';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto.ts';
import { AuthUpdateDto } from './dto/auth-update.dto.ts';
import { LoginResponseDto } from './dto/login-response.dto.ts';
import { JwtPayloadType } from './strategies/types/jwt-payload.type.ts';
import { IJwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type.ts';

@Injectable()
export class AuthService {
  constructor(
    private helperEncryptionService: HelperEncryptionService,
    private usersService: UserService,
    private sessionService: SessionService,
    private mailService: MailService,
    private config: ApiConfigService,
    private helperHashService: HelperHashService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUsernameOrEmail({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnprocessableEntityException('incorrect email or password');
    }

    if (!user.password) {
      throw new UnprocessableEntityException('incorrect email or password');
    }

    const isValidPassword = this.helperHashService.bcryptCompare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    const session = await this.sessionService.create({
      hash,
      user: user.toDto(),
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user: user.toDto(),
    };
  }

  async register(
    dto: AuthRegisterLoginDto,
    file?: Reference<IFile>,
  ): Promise<void> {
    const user = await this.usersService.createUser(dto, file);

    const hash = this.helperEncryptionService.jwtEncrypt(
      {
        confirmEmailUserId: user.id,
      },
      {
        secretKey: this.config.authConfig.confirmEmailSecret,
        expiredIn: this.config.authConfig.confirmEmailExpires,
      },
    );

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: UserDto['id'];

    try {
      const jwtData = await this.helperEncryptionService.jwtVerify<{
        confirmEmailUserId: UserEntity['id'];
      }>(hash, {
        secretKey: this.config.authConfig.confirmEmailSecret,
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.getUser(userId);

    await this.usersService.updateSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: true,
        isPhoneVerified: false,
      }),
    );
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: UserEntity['id'];
    let userNewEmail: UserEntity['email'];

    try {
      const jwtData = await this.helperEncryptionService.jwtVerify<{
        confirmEmailUserId: UserEntity['id'];
        userNewEmail: UserEntity['email'];
      }>(hash, {
        secretKey: this.config.authConfig.confirmEmailSecret,
      });

      userId = jwtData.confirmEmailUserId;
      userNewEmail = jwtData.userNewEmail;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.getUser(userId);

    user.email = userNewEmail;

    await this.usersService.update(user.id, user);

    await this.usersService.updateSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByUsernameOrEmail({ email });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    const tokenExpiresIn = this.config.authConfig.forgetExpires;

    const tokenExpires = Date.now() + Number(ms(tokenExpiresIn));

    const hash = this.helperEncryptionService.jwtEncrypt(
      {
        forgotUserId: user.id,
      },
      {
        secretKey: this.config.authConfig.forgotSecret,
        expiredIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: UserDto['id'];

    try {
      const jwtData = await this.helperEncryptionService.jwtVerify<{
        forgotUserId: UserDto['id'];
      }>(hash, {
        secretKey: this.config.authConfig.forgotSecret,
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.usersService.update(user.id, user);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto?: AuthUpdateDto,
  ): Promise<UserDto> {
    const currentUser = await this.usersService.findOne({
      id: userJwtPayload.id,
    });

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    if (userDto?.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'missingOldPassword',
          },
        });
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      }

      const isValidOldPassword = this.helperHashService.bcryptCompare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (isValidOldPassword) {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      } else {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      }
    }

    if (userDto?.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByUsernameOrEmail({
        email: userDto.email,
      });

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailExists',
          },
        });
      }

      const hash = this.helperEncryptionService.jwtEncrypt(
        {
          confirmEmailUserId: currentUser.id,
          userNewEmail: userDto.email,
        },
        {
          secretKey: this.config.authConfig.confirmEmailSecret,
          expiredIn: this.config.authConfig.confirmEmailExpires,
        },
      );

      await this.mailService.confirmNewEmail({
        to: userDto.email,
        data: {
          hash,
        },
      });
    }

    delete userDto?.email;
    delete userDto?.oldPassword;

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.getUser(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<IJwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.getUser(session.userId);

    if (!user.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: RoleType.USER,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: UserDto): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<IJwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: UserDto['id'];
    role: UserDto['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.config.authConfig.jwtExpirationTime;
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      this.helperEncryptionService.jwtEncrypt(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secretKey: this.config.authConfig.authSecret,
          expiredIn: tokenExpiresIn,
        },
      ),
      this.helperEncryptionService.jwtEncrypt(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secretKey: this.config.authConfig.refreshSecret,
          expiredIn: this.config.authConfig.refreshExpires,
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async delete(id: Uuid) {
    await this.usersService.softDelete(id);
  }
}
