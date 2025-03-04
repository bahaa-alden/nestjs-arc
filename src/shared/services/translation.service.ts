/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';

import { STATIC_TRANSLATION_DECORATOR_KEY } from '../../common/decorators/translate.decorator.ts';
import { AbstractDto } from '../../common/dto/abstract.dto.ts';
import type { ITranslationDecoratorInterface } from '../../common/interfaces/ITranslationDecoratorInterface.ts';
import { ContextProvider } from '../../providers/context.provider.ts';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(key, {
      ...options,
      lang: ContextProvider.getLanguage(),
    });
  }

  async translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T> {
    await Promise.all(
      _.map(dto, (value, key) => {
        if (_.isString(value)) {
          const translateDec: ITranslationDecoratorInterface | undefined =
            Reflect.getMetadata(
              STATIC_TRANSLATION_DECORATOR_KEY,
              Object.getPrototypeOf(dto),
              key,
            );

          if (translateDec) {
            const k = key as keyof T;
            dto[k] = this.translate(
              `${translateDec.translationKey ?? key}.${value}`,
            ) as T[keyof T];
          }
        }

        if (value instanceof AbstractDto) {
          return this.translateNecessaryKeys(value);
        }

        if (Array.isArray(value)) {
          return Promise.all(
            _.map(value, (v) => {
              if (v instanceof AbstractDto) {
                return this.translateNecessaryKeys(v);
              }

              return null;
            }),
          );
        }

        return null;
      }),
    );

    return dto;
  }
}
