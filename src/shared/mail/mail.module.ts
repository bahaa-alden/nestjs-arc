import { Module } from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service.ts';
import { MailService } from './mail.service.ts';
import { MailProcessor } from './mail.processor.ts';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from '../../constants/index.ts';
import { BullService } from '../services/bull.service.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAME }),
    BullModule.forRootAsync({
      useClass: BullService,
      imports: [ConfigModule],
    }),
  ],
  providers: [MailService, MailerService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
