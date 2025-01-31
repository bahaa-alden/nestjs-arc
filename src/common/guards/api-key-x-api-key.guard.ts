/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestError } from 'passport-headerapikey';

import { ApiKeyStatusCodeError } from '../constants/api-key-status-code.enum.ts';

@Injectable()
export class ApiKeyXApiKeyGuard extends AuthGuard('x-api-key') {
  handleRequest<IApiKeyPayload = any>(
    err: Error | null,
    apiKey: IApiKeyPayload | null,
    info: BadRequestError | null,
  ): IApiKeyPayload {
    if (err) {
      const statusCode = Number.parseInt(err.message, 10);

      if (Number.isNaN(statusCode)) {
        throw new UnauthorizedException({
          statusCode: ApiKeyStatusCodeError.X_API_KEY_INVALID,
          message: 'apiKey.error.xApiKey.invalid',
        });
      }

      switch (statusCode) {
        case ApiKeyStatusCodeError.X_API_KEY_NOT_FOUND: {
          throw new ForbiddenException({
            statusCode,
            message: 'apiKey.error.xApiKey.notFound',
          });
        }

        case ApiKeyStatusCodeError.X_API_KEY_INACTIVE: {
          throw new ForbiddenException({
            statusCode,
            message: 'apiKey.error.xApiKey.inactive',
          });
        }

        case ApiKeyStatusCodeError.X_API_KEY_EXPIRED: {
          throw new ForbiddenException({
            statusCode,
            message: 'apiKey.error.xApiKey.expired',
          });
        }

        default: {
          throw new UnauthorizedException({
            statusCode: ApiKeyStatusCodeError.X_API_KEY_INVALID,
            message: 'apiKey.error.xApiKey.invalid',
          });
        }
      }
    }

    if (!apiKey || (info && info.message === 'Missing Api Key')) {
      throw new UnauthorizedException({
        statusCode: ApiKeyStatusCodeError.X_API_KEY_REQUIRED,
        message: 'apiKey.error.xApiKey.required',
      });
    }

    return apiKey;
  }
}
