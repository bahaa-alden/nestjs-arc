/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';

import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import type { Job } from 'bull';

import { QUEUE_NAME } from '../../common/constants/index.ts';
import { MaybeType } from '../../common/types/maybe.type.ts';
import { LoggerService } from '../logger/logger.service.ts';
import { MailerService } from '../mailer/mailer.service.ts';
import { ApiConfigService } from '../services/api-config.service.ts';
import { TranslationService } from '../services/translation.service.ts';
import { MailData } from './interfaces/mail-data.interface.ts';

// Import utility functions and configurations

// Decorate the class as a processor for the specified queue
@Processor(QUEUE_NAME)
export class MailProcessor {
  // Constructor to inject configuration and mailer service
  constructor(
    private apiConfig: ApiConfigService,
    private readonly mailerService: MailerService,
    private loggerService: LoggerService,
    private readonly translationService: TranslationService,
  ) {}

  // Event handler for when a job in the queue becomes active
  @OnQueueActive()
  onActive(job: Job) {
    this.loggerService.debug(
      this.constructor.name,
      `processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  // Event handler for when a job in the queue is completed
  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.loggerService.debug(
      this.constructor.name,

      `completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  // Event handler for when a job in the queue fails
  @OnQueueFailed()
  onError(job: Job, error: any) {
    this.loggerService.error(
      this.constructor.name,

      `failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  // Process decorator for handling jobs of type 'welcome'
  @Process('welcome')
  async sendWelcomeEmail(
    job: Job<{ mailData: MailData<{ hash: string }> }>,
  ): Promise<any> {
    const { mailData } = job.data;

    // Log the initiation of sending a welcome email
    this.loggerService.log(
      this.constructor.name,
      `sending welcome email to '${job.data.mailData.to}'`,
    );

    // If in a live environment, return a mock confirmation message
    if (this.apiConfig.mailConfig.isLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the welcome email using the mailer service
      const [emailConfirmTitle, text1, text2, text3]: Array<MaybeType<string>> =
        await Promise.all([
          this.translationService.translate('common.confirmEmail'),
          this.translationService.translate('confirm-email.text1'),
          this.translationService.translate('confirm-email.text2'),
          this.translationService.translate('confirm-email.text3'),
        ]);

      const url = new URL(
        `${this.apiConfig.appConfig.frontendDomain}/confirm-email`,
      );
      url.searchParams.set('hash', mailData.data.hash);

      await this.mailerService.sendMail({
        to: mailData.to,
        subject: emailConfirmTitle,
        text: `${url.toString()} ${emailConfirmTitle}`,
        templatePath: path.join(
          import.meta.dirname,
          'mail-templates',
          'activation.hbs',
        ),
        context: {
          title: emailConfirmTitle,
          url: url.toString(),
          actionTitle: emailConfirmTitle,
          app_name: this.apiConfig.appConfig.name,
          text1,
          text2,
          text3,
          year: new Date().getFullYear(),
        },
      });
    } catch (error: any) {
      // Log an error if the email sending fails and propagate the error
      this.loggerService.error(
        this.constructor.name,

        `failed to send welcome email to '${job.data.mailData.to}'`,
        error.stack,
      );

      throw error;
    }
  }

  // Process decorator for handling jobs of type 'welcome'
  @Process('passwordReset')
  async sendPasswordReset(
    job: Job<{ mailData: MailData<{ hash: string; tokenExpires: number }> }>,
  ): Promise<any> {
    const { mailData } = job.data;
    // Log the initiation of sending a reset password email
    this.loggerService.log(
      this.constructor.name,
      `sending password reset token to '${job.data.mailData.to}'`,
    );

    // If in a live environment, return a mock confirmation message
    if (this.apiConfig.mailConfig.isLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the reset password token using the mailer service
      const [resetPasswordTitle, text1, text2, text3, text4]: Array<
        MaybeType<string>
      > = await Promise.all([
        this.translationService.translate('common.resetPassword'),
        this.translationService.translate('reset-password.text1'),
        this.translationService.translate('reset-password.text2'),
        this.translationService.translate('reset-password.text3'),
        this.translationService.translate('reset-password.text4'),
      ]);

      const url = new URL(
        `${this.apiConfig.appConfig.frontendDomain}/password-change`,
      );
      url.searchParams.set('hash', mailData.data.hash);
      url.searchParams.set('expires', mailData.data.tokenExpires.toString());

      await this.mailerService.sendMail({
        to: mailData.to,
        subject: resetPasswordTitle,
        text: `${url.toString()} ${resetPasswordTitle}`,
        templatePath: path.join(
          import.meta.dirname,
          'mail-templates',
          'reset-password.hbs',
        ),
        context: {
          title: resetPasswordTitle,
          url: url.toString(),
          actionTitle: resetPasswordTitle,
          app_name: this.apiConfig.appConfig.name,
          text1,
          text2,
          text3,
          text4,
        },
      });
    } catch (error: any) {
      // Log an error if the email sending fails and propagate the error
      this.loggerService.error(
        this.constructor.name,

        `failed to send password reset token to '${job.data.mailData.to}'`,
        error.stack,
      );

      throw error;
    }
  }

  @Process('confirmEmail')
  async sendConfirmEmail(
    job: Job<{ mailData: MailData<{ hash: string }> }>,
  ): Promise<any> {
    const { mailData } = job.data;

    // Log the initiation of sending a password changed email
    this.loggerService.log(
      this.constructor.name,

      `sending password changed message to '${job.data.mailData.to}'`,
    );

    // If in a live environment, return a mock confirmation message
    if (this.apiConfig.mailConfig.isLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the password changed message using the mailer service
      const [emailConfirmTitle, text1, text2, text3]: Array<MaybeType<string>> =
        await Promise.all([
          this.translationService.translate('common.confirmEmail'),
          this.translationService.translate('confirm-new-email.text1'),
          this.translationService.translate('confirm-new-email.text2'),
          this.translationService.translate('confirm-new-email.text3'),
        ]);

      const url = new URL(
        `${this.apiConfig.appConfig.frontendDomain}/confirm-new-email`,
      );
      url.searchParams.set('hash', mailData.data.hash);

      await this.mailerService.sendMail({
        to: mailData.to,
        subject: emailConfirmTitle,
        text: `${url.toString()} ${emailConfirmTitle}`,
        templatePath: path.join(
          import.meta.dirname,
          'mail-templates',
          'confirm-new-email.hbs',
        ),
        context: {
          title: emailConfirmTitle,
          url: url.toString(),
          actionTitle: emailConfirmTitle,
          app_name: this.apiConfig.appConfig.name,
          text1,
          text2,
          text3,
        },
      });
    } catch (error: any) {
      // Log an error if the email sending fails and propagate the error
      this.loggerService.error(
        this.constructor.name,

        `failed to send password changed message to '${job.data.mailData.to}'`,
        error.stack,
      );

      throw error;
    }
  }
}
