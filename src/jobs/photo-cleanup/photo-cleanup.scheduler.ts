import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';

import { PhotoCleanupService } from './photo-cleanup.service.ts';

@Injectable()
export class PhotoCleanupScheduler {
  constructor(
    private readonly imageCleanupService: PhotoCleanupService,
    private logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleFileCleanup() {
    try {
      this.imageCleanupService.deletePhotosOlderThanDays();
      this.logger.info(
        `photo cleanup completed for 1 days.`,
        'PhotoCleanupService',
      );
    } catch (error) {
      this.logger.error(
        `error occurred during file cleanup: ${error}`,
        'PhotoCleanupService',
      );
    }
  }
}
