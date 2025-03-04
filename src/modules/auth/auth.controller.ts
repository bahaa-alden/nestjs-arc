import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type.ts';
import { AuthUser } from '../../common/decorators/auth-user.decorator.ts';
import { Auth } from '../../common/decorators/http.decorators.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { AuthService } from './auth.service.ts';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto.ts';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto.ts';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto.ts';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto.ts';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto.ts';
import { AuthUpdateDto } from './dto/auth-update.dto.ts';
import { LoginResponseDto } from './dto/login-response.dto.ts';
import { RefreshResponseDto } from './dto/refresh-response.dto.ts';
import type { JwtPayloadType } from './strategies/types/jwt-payload.type.ts';
import type { IJwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type.ts';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('email/login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.authService.validateLogin(loginDto);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.authService.confirmEmail(confirmEmailDto.hash);
  }

  @Post('email/confirm/new')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmNewEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.authService.confirmNewEmail(confirmEmailDto.hash);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Auth({ jwtRefreshToken: true })
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public refresh(
    @AuthUser() user: IJwtRefreshPayloadType,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken({
      sessionId: user.sessionId,
      hash: user.hash,
    });
  }

  @Auth({ roles: [RoleType.USER, RoleType.ADMIN], jwtAccessToken: true })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@AuthUser() user: IJwtRefreshPayloadType): Promise<void> {
    await this.authService.logout({
      sessionId: user.sessionId,
    });
  }

  @Auth({ roles: [RoleType.USER, RoleType.ADMIN], jwtAccessToken: true })
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
  })
  public update(
    @AuthUser() user: JwtPayloadType,
    @Body() userDto: AuthUpdateDto,
  ): Promise<UserDto | null> {
    return this.authService.update(user, userDto);
  }

  @Auth({ roles: [RoleType.USER, RoleType.ADMIN], jwtAccessToken: true })
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@AuthUser() user: JwtPayloadType): Promise<void> {
    return this.authService.delete(user.id);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth({ roles: [RoleType.USER, RoleType.ADMIN], jwtAccessToken: true })
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  async getCurrentUser(@AuthUser() user: JwtPayloadType): Promise<UserDto> {
    return this.authService.update(user);
  }
}
