/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ExecutionContext } from '@nestjs/common';
import {
  applyDecorators,
  createParamDecorator,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import type { IRequestApp } from '../../shared/request/interfaces/request.interface.ts';
import { API_KEY_X_TYPE_META_KEY } from '../constants/api-key.constant.ts';
import { ApiKeyType } from '../constants/api-key.enum.ts';
import { ApiKeyXApiKeyGuard } from '../guards/api-key-x-api-key.guard.ts';
import { ApiKeyXApiKeyTypeGuard } from '../guards/api-key-x-api-key-type.guard.ts';

export const ApiKeyPayload: () => ParameterDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): unknown => {
    const { apiKey } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { apiKey: any }>();

    return data ? apiKey[data] : apiKey;
  },
);

export function ApiKeySystemProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyXApiKeyGuard, ApiKeyXApiKeyTypeGuard),
    SetMetadata(API_KEY_X_TYPE_META_KEY, [ApiKeyType.SYSTEM]),
  );
}

export function ApiKeyProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyXApiKeyGuard, ApiKeyXApiKeyTypeGuard),
    SetMetadata(API_KEY_X_TYPE_META_KEY, [ApiKeyType.DEFAULT]),
  );
}
