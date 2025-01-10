import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { ApiFile } from '../../decorators/swagger.schema.ts';
import { IFile } from '../../interfaces/IFile.ts';
import type { Reference } from '../../types.ts';
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
  @ApiFile({ name: 'avatar' })
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
    @UploadedFile() file?: Reference<IFile>,
  ): Promise<void> {
    return this.authService.register(createUserDto, file);
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

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @AuthUser() user: IJwtRefreshPayloadType,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken({
      sessionId: user.sessionId,
      hash: user.hash,
    });
  }

  @Auth([RoleType.USER, RoleType.ADMIN])
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@AuthUser() user: IJwtRefreshPayloadType): Promise<void> {
    await this.authService.logout({
      sessionId: user.sessionId,
    });
  }

  @Auth([RoleType.USER, RoleType.ADMIN])
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

  @Auth([RoleType.USER, RoleType.ADMIN])
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@AuthUser() user: JwtPayloadType): Promise<void> {
    return this.authService.delete(user.id);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  async getCurrentUser(@AuthUser() user: JwtPayloadType): Promise<UserDto> {
    return this.authService.update(user);
  }
}
