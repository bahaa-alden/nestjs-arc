import { Injectable } from '@nestjs/common';
import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { UserEntity } from '../modules/user/user.entity.ts';
import { HelperHashService } from '../shared/helper/services/helper-hash.service.ts';

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private helperService: HelperHashService) {
    this.helperService = new HelperHashService();
  }

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      const salt = this.helperService.randomSalt(7);
      event.entity.password = this.helperService.bcrypt(
        event.entity.password,
        salt,
      );
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity as UserEntity;

    if (entity.password && entity.password !== event.databaseEntity.password) {
      const salt = this.helperService.randomSalt(7);
      entity.password = this.helperService.bcrypt(entity.password, salt);
    }
  }
}
