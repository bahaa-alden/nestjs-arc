import { Module } from '@nestjs/common';

import { DocumentSessionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module.ts';
import { SessionService } from './session.service.ts';

const infrastructurePersistenceModule = DocumentSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
