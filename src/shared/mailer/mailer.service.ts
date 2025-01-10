import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index';

import { ApiConfigService } from '../services/api-config.service.ts';

interface ICustomSendMailOptions extends SendMailOptions {
  templatePath: string;
  context: Record<string, unknown>;
}

@Injectable()
export class MailerService {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ApiConfigService) {
    this.transporter = createTransport({
      host: configService.mailConfig.host,
      port: configService.mailConfig.port,
      ignoreTLS: configService.mailConfig.ignoreTLS,
      secure: configService.mailConfig.secure,
      requireTLS: configService.mailConfig.requireTLS,
      auth: {
        user: configService.mailConfig.auth.user,
        pass: configService.mailConfig.auth.pass,
      },
    }); // Ensure the correct type here
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: ICustomSendMailOptions): Promise<void> {
    let html: string | undefined;

    if (templatePath) {
      try {
        const template = await fs.readFile(templatePath, 'utf8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      } catch (error) {
        throw new Error(
          `Failed to read or compile the template: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from:
        mailOptions.from ??
        `"${this.configService.mailConfig.defaultName}" <${this.configService.mailConfig.defaultEmail}>`,
      html: mailOptions.html ?? html,
    });
  }
}
