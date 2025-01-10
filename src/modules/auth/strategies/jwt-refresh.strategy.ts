import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ApiConfigService } from '../../../shared/services/api-config.service.ts';
import { IJwtRefreshPayloadType } from './types/jwt-refresh-payload.type.ts';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.refreshSecret,
    });
  }

  public validate(
    payload: IJwtRefreshPayloadType,
  ): IJwtRefreshPayloadType | never {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
