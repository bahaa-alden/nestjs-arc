import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { LoggerOptionModule } from '../../shared/logger/logger-option.module.ts';
import { LoggerOptionService } from '../../shared/logger/services/logger-option.service.ts';
import { PhotoCleanupScheduler } from './photo-cleanup.scheduler.ts';
import { PhotoCleanupService } from './photo-cleanup.service.ts';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerOptionModule],
      inject: [LoggerOptionService],
      useFactory: (loggerOptionService: LoggerOptionService) =>
        loggerOptionService.createOptions(),
    }),
  ],
  providers: [PhotoCleanupService, PhotoCleanupScheduler],
})
export class PhotoCleanupModule {}
