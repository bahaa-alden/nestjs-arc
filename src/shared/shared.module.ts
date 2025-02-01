import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { HelperModule } from './helper/helper.module.ts';
import { LoggerOptionModule } from './logger/logger-option.module.ts';
import { LoggerOptionService } from './logger/services/logger-option.service.ts';
import { MailModule } from './mail/mail.module.ts';
import { RequestModule } from './request/request.module.ts';
import { ApiConfigService } from './services/api-config.service.ts';
import { AwsS3Service } from './services/aws-s3.service.ts';
import { CloudinaryService } from './services/cloudinary.service.ts';
import { GeneratorService } from './services/generator.service.ts';
import { TranslationService } from './services/translation.service.ts';
import { ValidatorService } from './services/validator.service.ts';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  TranslationService,
  LoggerOptionService,
  CloudinaryService,
];

@Global()
@Module({
  providers,
  imports: [
    CqrsModule,
    MailModule,
    MailModule,
    HelperModule.forRoot(),
    RequestModule.forRoot(),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerOptionModule],
      inject: [LoggerOptionService],
      useFactory: (loggerOptionService: LoggerOptionService) =>
        loggerOptionService.createOptions(),
    }),
  ],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
