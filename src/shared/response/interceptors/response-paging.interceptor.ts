/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LanguageCode } from '../../../common/constants/language-code.ts';
import { PageDto } from '../../../common/dto/page.dto.ts';
import { ContextProvider } from '../../../providers/context.provider.ts';
import { HelperDateService } from '../../helper/services/helper-date.service.ts';
import { IRequestApp } from '../../request/interfaces/request.interface.ts';
import {
  ResponsePagingDto,
  ResponsePagingMetadataDto,
} from '../dtos/response-paging.dto.ts';

@Injectable()
export class ResponsePagingInterceptor
  implements NestInterceptor<Promise<ResponsePagingDto>>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<ResponsePagingDto>> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<Promise<ResponsePagingDto>>;
    }

    return next.handle().pipe(
      map(async (res: Promise<PageDto<any>>) => {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const response: Response = ctx.getResponse();
        const request: IRequestApp = ctx.getRequest<IRequestApp>();
        const today = this.helperDateService.create();
        const xLanguage = ContextProvider.getLanguage() ?? LanguageCode.en;
        const xTimestamp = this.helperDateService.getTimestamp(today);
        const xTimezone = this.helperDateService.getZone(today);
        const xVersion =
          request.__version ??
          this.configService.get<string>('app.urlVersion.version') ??
          '1.0';

        const responseData = await res;

        if (!responseData || !Array.isArray(responseData.data)) {
          throw new Error(
            'ResponsePaging must be an instance of IResponsePaging with a valid data array',
          );
        }

        const { paginationMeta, data, _pagination } = responseData;
        const httpStatus = response.statusCode;
        const statusCode = response.statusCode;

        const metadata: ResponsePagingMetadataDto = {
          language: xLanguage,
          timestamp: xTimestamp,
          timezone: xTimezone,
          path: request.path,
          version: xVersion,
          pagination: {
            ...request.__pagination,
            ..._pagination,
          },
        };

        response.setHeader('x-custom-lang', xLanguage);
        response.setHeader('x-timestamp', xTimestamp);
        response.setHeader('x-timezone', xTimezone);
        response.setHeader('x-version', xVersion);
        response.status(httpStatus);

        return {
          statusCode,
          _metadata: metadata,
          paginationMeta,
          data,
        };
      }),
    ) as Observable<Promise<ResponsePagingDto>>;
  }
}
