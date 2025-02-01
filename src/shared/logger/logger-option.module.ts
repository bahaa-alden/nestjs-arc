import { Module } from '@nestjs/common';

import { LoggerOptionService } from './services/logger-option.service.ts';

@Module({
  imports: [],
  providers: [LoggerOptionService],
  exports: [LoggerOptionService],
})
export class LoggerOptionModule {}
