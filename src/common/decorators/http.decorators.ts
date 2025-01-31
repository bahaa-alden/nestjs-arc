import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { CanActivate, Type } from '@nestjs/common/interfaces';
import type { IAuthGuard } from '@nestjs/passport';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { IDocAuthOptions } from '../doc/interfaces/doc.interface.ts';
import { AuthGuard } from '../guards/auth.guard.ts';
import { RolesGuard } from '../guards/roles.guard.ts';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service.ts';
import { ApiKeyProtected } from './api-key.decorator.ts';
import { PublicRoute } from './public-route.decorator.ts';
import { Roles } from './roles.decorator.ts';

export function Auth(options?: IDocAuthOptions): MethodDecorator {
  const isPublicRoute = options?.public;
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  const guards: CanActivate[] & Array<Type<IAuthGuard>> = [];

  if (options?.jwtAccessToken) {
    docs.push(ApiBearerAuth('accessToken'));
    guards.push(AuthGuard({ public: isPublicRoute }));
  }

  if (options?.jwtRefreshToken) {
    docs.push(ApiBearerAuth('refreshToken'));
    guards.push(PassportAuthGuard('jwt-refresh'));
  }

  if (options?.xApiKey) {
    docs.push(ApiSecurity('xApiKey'), ApiKeyProtected());
  }

  return applyDecorators(
    ...docs,
    Roles(options?.roles ?? []),
    UseGuards(...guards, RolesGuard),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
