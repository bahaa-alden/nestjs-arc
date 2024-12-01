import { Module } from '@nestjs/common';

import { SessionFeatureModule } from './feature/feature.module.ts';
import { SessionService } from './session.service.ts';

@Module({
  imports: [SessionFeatureModule],
  providers: [SessionService],
  exports: [SessionService, SessionFeatureModule],
})
export class SessionModule {}
