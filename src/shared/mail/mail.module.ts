import { Module } from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service.ts';
import { MailService } from './mail.service.ts';

@Module({
  imports: [],
  providers: [MailService, MailerService],
  exports: [MailService],
})
export class MailModule {}
