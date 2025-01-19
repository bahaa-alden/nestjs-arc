import { Injectable } from '@nestjs/common';

import { MailData } from './interfaces/mail-data.interface.ts';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '../../constants/index.ts';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QUEUE_NAME)
    private mailQueue: Queue,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    await this.mailQueue.add('welcome', { mailData });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    await this.mailQueue.add('passwordReset', { mailData });
  }

  async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    await this.mailQueue.add('confirmEmail', { mailData });
  }
}
