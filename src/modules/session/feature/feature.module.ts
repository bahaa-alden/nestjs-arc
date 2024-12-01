import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionRepository } from '../interfaces/session.repository.ts';
import { SessionEntity } from './session.entity.ts';
import { SessionFeatureRepository } from './session.repository.ts';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionFeatureRepository,
    },
  ],
  exports: [SessionRepository],
})
export class SessionFeatureModule {}
