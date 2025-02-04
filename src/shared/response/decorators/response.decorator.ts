import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';

import { ApiPageResponse } from '../../../common/decorators/api-page-response.decorator.ts';
import { UseLanguageInterceptor } from '../../../common/interceptors/language-interceptor.service.ts';
import { UseResponsePagingInterceptor } from '../interceptors/response-paging.interceptor.ts';

export function ResponsePaging(options: {
  type: Type;
  description?: string;
}): MethodDecorator {
  const decorators: MethodDecorator[] = [
    ApiPageResponse({
      description: options.description,
      type: options.type,
    }),
    UseLanguageInterceptor(),
    UseResponsePagingInterceptor(),
  ];

  return applyDecorators(...decorators);
}
