import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from '../../../session.entity.ts';
import { SessionRepository } from '../session.repository.ts';
import { SessionDocumentRepository } from './repositories/session.repository.ts';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionDocumentRepository,
    },
  ],
  exports: [SessionRepository],
})
export class DocumentSessionPersistenceModule {}
