import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import {
  Doc,
  DocDefault,
  DocErrorGroup,
  DocGuard,
  DocOneOf,
  DocRequest,
  DocResponse,
} from '../../../common/doc/decorators/doc.decorator.ts';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/enums/doc.enum.ts';
import { ApiKeyDto } from '../dtos/api-key.dto.ts';
import { ApiKeyCreateRawRequestDto } from '../dtos/request/api-key-create-request.dto.ts';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key-update-request.dto.ts';
import { ApiKeyStatusCodeError } from '../../../common/constants/api-key-status-code.enum.ts';
import { apiKeyDocParamsId } from './api-key-doc.constant.ts';

export function ApiKeyAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'get detail an api key' }),
    DocRequest({
      params: apiKeyDocParamsId,
    }),
    DocResponse<ApiKeyDto>('apiKey.get', {
      dto: ApiKeyDto,
    }),
    DocGuard({ policy: true }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ApiKeyStatusCodeError.NOT_FOUND,
        messagePath: 'apiKey.error.notFound',
      }),
    ]),
  );
}

export function ApiKeyAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create an api key' }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ApiKeyCreateRawRequestDto,
    }),
    DocGuard({ policy: true }),
    DocResponse<ApiKeyDto>('apiKey.create', {
      httpStatus: HttpStatus.CREATED,
      dto: ApiKeyDto,
    }),
  );
}

export function ApiKeyAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make api key be active' }),
    DocRequest({
      params: apiKeyDocParamsId,
    }),
    DocResponse('apiKey.active'),
    DocGuard({ policy: true }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ApiKeyStatusCodeError.NOT_FOUND,
        messagePath: 'apiKey.error.notFound',
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ApiKeyStatusCodeError.EXPIRED,
          messagePath: 'apiKey.error.expired',
        },
        {
          statusCode: ApiKeyStatusCodeError.IS_ACTIVE,
          messagePath: 'apiKey.error.isActiveInvalid',
        },
      ),
    ]),
  );
}

export function ApiKeyAdminInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make api key be inactive' }),
    DocRequest({
      params: apiKeyDocParamsId,
    }),
    DocResponse('apiKey.inactive'),
    DocGuard({ policy: true }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ApiKeyStatusCodeError.NOT_FOUND,
        messagePath: 'apiKey.error.notFound',
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ApiKeyStatusCodeError.EXPIRED,
          messagePath: 'apiKey.error.expired',
        },
        {
          statusCode: ApiKeyStatusCodeError.IS_ACTIVE,
          messagePath: 'apiKey.error.isActiveInvalid',
        },
      ),
    ]),
  );
}

export function ApiKeyAdminResetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'reset secret an api key' }),
    DocRequest({
      params: apiKeyDocParamsId,
    }),
    DocGuard({ policy: true }),
    DocResponse<ApiKeyDto>('apiKey.reset', {
      dto: ApiKeyDto,
    }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ApiKeyStatusCodeError.NOT_FOUND,
        messagePath: 'apiKey.error.notFound',
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ApiKeyStatusCodeError.EXPIRED,
          messagePath: 'apiKey.error.expired',
        },
        {
          statusCode: ApiKeyStatusCodeError.IS_ACTIVE,
          messagePath: 'apiKey.error.isActiveInvalid',
        },
      ),
    ]),
  );
}

export function ApiKeyAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update data an api key' }),
    DocRequest({
      params: apiKeyDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ApiKeyUpdateRequestDto,
    }),
    DocGuard({ policy: true }),
    DocResponse('apiKey.update'),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ApiKeyStatusCodeError.NOT_FOUND,
        messagePath: 'apiKey.error.notFound',
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ApiKeyStatusCodeError.EXPIRED,
          messagePath: 'apiKey.error.expired',
        },
        {
          statusCode: ApiKeyStatusCodeError.IS_ACTIVE,
          messagePath: 'apiKey.error.isActiveInvalid',
        },
      ),
    ]),
  );
}

export function ApiKeyAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'delete an api key' }),
    DocRequest({
      params: apiKeyDocParamsId,
    }),
    DocGuard({ policy: true }),
    DocResponse('apiKey.delete'),
  );
}
