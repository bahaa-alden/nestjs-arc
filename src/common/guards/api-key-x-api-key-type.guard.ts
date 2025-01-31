import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IRequestApp } from '../../shared/request/interfaces/request.interface.ts';
import { API_KEY_X_TYPE_META_KEY } from '../constants/api-key.constant.ts';
import { ApiKeyType } from '../constants/api-key.enum.ts';
import { ApiKeyStatusCodeError } from '../constants/api-key-status-code.enum.ts';

@Injectable()
export class ApiKeyXApiKeyTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required: ApiKeyType[] = this.reflector.getAllAndOverride<
      ApiKeyType[]
    >(API_KEY_X_TYPE_META_KEY, [context.getHandler(), context.getClass()]);

    if (required.length === 0) {
      return true;
    }

    const { apiKey } = context.switchToHttp().getRequest<IRequestApp>();

    if (!apiKey) {
      return true;
    }

    if (!required.includes(apiKey.type!)) {
      throw new BadRequestException({
        statusCode: ApiKeyStatusCodeError.X_API_KEY_FORBIDDEN,
        message: 'apiKey.error.xApiKey.forbidden',
      });
    }

    return true;
  }
}
