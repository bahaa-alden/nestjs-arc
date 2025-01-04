/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable sonarjs/no-nested-conditional */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

import { ErrorType } from '../constants/error-type.enum.ts';

const handelPassportError = () =>
  new UnauthorizedException({ message: 'الرجاء تسجيل الدخول' });

const handelDuplicatedRecords = (detail: string) => {
  const match = /Key \("(.+)", "(.+)"\)/.exec(detail);

  return new ConflictException(
    `Record already exist on table(s): ${match![1]}, ${match![2]}`,
  );
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    exception =
      exception.code === '23505'
        ? handelDuplicatedRecords(exception.detail)
        : exception.code === '23503'
          ? new NotFoundException(`${exception.detail} not found`)
          : exception instanceof HttpException
            ? exception
            : new InternalServerErrorException('something went very wrong');

    if (exception.message === 'Unauthorized') {
      exception = handelPassportError();
    }

    const rep = {
      type: exception.response.errors ? ErrorType.Form : ErrorType.Default,
      message: exception.response.errors ? undefined : exception.message,
      errors: exception.response.errors,
    };
    this.reply(response, rep, exception.getStatus());
  }

  reply(response: Response, rep: any, status: number) {
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(response, rep, status);
  }
}
