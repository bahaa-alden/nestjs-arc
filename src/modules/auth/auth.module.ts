import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailModule } from '../../shared/mail/mail.module.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { SessionModule } from '../session/session.module.ts';
import { UserModule } from '../user/user.module.ts';
import { AuthController } from './auth.controller.ts';
import { AuthService } from './auth.service.ts';
import { JwtStrategy } from './strategies/jwt.strategy.ts';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy.ts';
import { PublicStrategy } from './strategies/public.strategy.ts';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.authSecret,
      }),
      inject: [ApiConfigService],
    }),
    SessionModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
