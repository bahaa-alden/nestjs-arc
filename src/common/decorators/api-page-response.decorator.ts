import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { ResponsePagingDto } from '../../shared/response/dtos/response-paging.dto.ts';

export function ApiPageResponse(options: {
  type: Type;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ResponsePagingDto),
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponsePagingDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
}
