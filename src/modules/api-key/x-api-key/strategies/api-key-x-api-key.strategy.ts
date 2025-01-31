/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { ApiKeyStatusCodeError } from '../../../../common/constants/api-key-status-code.enum.ts';
import { HelperDateService } from '../../../../shared/helper/services/helper-date.service.ts';
import { ApiKeyService } from '../../services/api-key.service.ts';
@Injectable()
export class ApiKeyXApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'x-api-key',
) {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly helperDateService: HelperDateService,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, false);
  }

  async validate(
    xApiKey: string,
    verified: (
      error: Error,
      user?: Record<string, any> | null,
      info?: string | number | null,
    ) => Promise<void>,
  ): Promise<void> {
    const xApiKeyArr: string[] = xApiKey.split(':');

    if (xApiKeyArr.length !== 2) {
      return verified(
        new Error(`${ApiKeyStatusCodeError.X_API_KEY_INVALID}`),
        null,
        `${ApiKeyStatusCodeError.X_API_KEY_INVALID}`,
      );
    }

    const key = xApiKeyArr[0] ?? '';
    const secret = xApiKeyArr[1] ?? '';
    const today = this.helperDateService.create();
    const apiKey = await this.apiKeyService.findOneByActiveKey(key);

    if (!apiKey) {
      return verified(
        new Error(`${ApiKeyStatusCodeError.X_API_KEY_NOT_FOUND}`),
        null,
        null,
      );
    } else if (!apiKey.isActive) {
      return verified(
        new Error(`${ApiKeyStatusCodeError.X_API_KEY_INACTIVE}`),
        null,
        null,
      );
    } else if (apiKey.startDate && apiKey.endDate) {
      if (today > apiKey.endDate) {
        return verified(
          new Error(`${ApiKeyStatusCodeError.X_API_KEY_EXPIRED}`),
          null,
          null,
        );
      } else if (apiKey.startDate > today) {
        return verified(
          new Error(`${ApiKeyStatusCodeError.X_API_KEY_INACTIVE}`),
          null,
          null,
        );
      }
    }

    const hashed = this.apiKeyService.createHashApiKey(key, secret);
    const isValidateApiKey = this.apiKeyService.validateHashApiKey(
      hashed,
      apiKey.hash,
    );

    if (!isValidateApiKey) {
      return verified(
        new Error(`${ApiKeyStatusCodeError.X_API_KEY_INVALID}`),
        null,
        null,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return verified(null as unknown as any, apiKey);
  }
}
