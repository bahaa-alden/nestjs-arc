import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { QUEUE_NAME } from '../../common/constants/index.ts';
import { LoggerOptionModule } from '../logger/logger-option.module.ts';
import { LoggerOptionService } from '../logger/services/logger-option.service.ts';
import { MailerService } from '../mailer/mailer.service.ts';
import { BullService } from '../services/bull.service.ts';
import { MailProcessor } from './mail.processor.ts';
import { MailService } from './mail.service.ts';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAME }),
    BullModule.forRootAsync({
      useClass: BullService,
      imports: [ConfigModule],
    }),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerOptionModule],
      inject: [LoggerOptionService],
      useFactory: (loggerOptionService: LoggerOptionService) =>
        loggerOptionService.createOptions(),
    }),
  ],
  providers: [MailService, MailerService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
