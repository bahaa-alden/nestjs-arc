/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IncomingMessage, ServerResponse } from 'node:http';

import { Injectable } from '@nestjs/common';
import { Params } from 'nestjs-pino';

import { AppEnv } from '../../../common/constants/app.enum.ts';
import { IRequestApp } from '../../request/interfaces/request.interface.ts';
import { ApiConfigService } from '../../services/api-config.service.ts';
@Injectable()
export class LoggerOptionService {
  private readonly env: AppEnv;

  private readonly name: string;

  private readonly debugEnable: boolean;

  private readonly debugLevel: string;

  constructor(private configService: ApiConfigService) {
    this.env = this.configService.nodeEnv;
    this.name = this.configService.appConfig.name;

    this.debugEnable = this.configService.debugConfig.debugEnable;
    this.debugLevel = this.configService.debugConfig.debugLevel;
  }

  createOptions(): Params {
    return {
      pinoHttp: {
        level: this.debugEnable ? this.debugLevel : 'silent',
        formatters: {
          level: (label: string) => ({ level: label.toUpperCase() }),
        },
        messageKey: 'message',
        timestamp: false,
        base: {
          app: this.name,
          env: this.env,
          date: new Date().toISOString(),
        },
        customProps: (req: IncomingMessage, _res: ServerResponse) => {
          const request = req as IRequestApp; // Safely cast for extra properties

          return {
            context: 'HTTP',
            'x-request-id': request.id,
          };
        },
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers["x-api-key"]',
            'req.body.password',
            'req.body.newPassword',
            'req.body.oldPassword',
            'res.headers["set-cookie"]',
          ],
          censor: '**REDACTED**',
        },
        serializers: {
          req(request: IRequestApp) {
            return {
              id: request.id,
              method: request.method,
              url: request.url,
              queries: request.query,
              parameters: request.params,
              headers: request.headers,

              body: request.body,
            };
          },
          res(response: { statusCode: unknown; headers: unknown }) {
            return {
              statusCode: response.statusCode,
              headers: response.headers,
            };
          },
          err(error: {
            type: unknown;
            message: unknown;
            stack: unknown;
            code: unknown;
          }) {
            return {
              type: error.type,
              message: error.message,
              stack: error.stack,
              code: error.code,
            };
          },
        },
        transport:
          this.env === AppEnv.development
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                  levelFirst: true,
                  // Add additional styling if needed
                  singleLine: false,
                },
              }
            : undefined,
      },
    };
  }
}
