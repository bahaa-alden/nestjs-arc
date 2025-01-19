import type {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullService implements SharedBullConfigurationFactory {
  constructor(private config: ConfigService) {}

  createSharedConfiguration(): BullRootModuleOptions {
    return {
      url: this.config.get('REDIS_URL'),
    };
  }
}
