import path from 'node:path';

import { Injectable } from '@nestjs/common';

import { MaybeType } from '../../types/maybe.type.ts';
import { MailerService } from '../mailer/mailer.service.ts';
import { ApiConfigService } from '../services/api-config.service.ts';
import { TranslationService } from '../services/translation.service.ts';
import { MailData } from './interfaces/mail-data.interface.ts';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ApiConfigService,
    private readonly translationService: TranslationService,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const [emailConfirmTitle, text1, text2, text3]: Array<MaybeType<string>> =
      await Promise.all([
        this.translationService.translate('common.confirmEmail'),
        this.translationService.translate('confirm-email.text1'),
        this.translationService.translate('confirm-email.text2'),
        this.translationService.translate('confirm-email.text3'),
      ]);

    const url = new URL(
      `${this.configService.appConfig.frontendDomain}/confirm-email`,
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
        app_name: this.configService.appConfig.name,
        text1,
        text2,
        text3,
        year: new Date().getFullYear(),
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
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
      `${this.configService.appConfig.frontendDomain}/password-change`,
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
        app_name: this.configService.appConfig.name,
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const [emailConfirmTitle, text1, text2, text3]: Array<MaybeType<string>> =
      await Promise.all([
        this.translationService.translate('common.confirmEmail'),
        this.translationService.translate('confirm-new-email.text1'),
        this.translationService.translate('confirm-new-email.text2'),
        this.translationService.translate('confirm-new-email.text3'),
      ]);

    const url = new URL(
      `${this.configService.appConfig.frontendDomain}/confirm-new-email`,
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
        app_name: this.configService.appConfig.name,
        text1,
        text2,
        text3,
      },
    });
  }
}
