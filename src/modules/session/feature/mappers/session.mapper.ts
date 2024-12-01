import { UserEntity } from '../../../user/user.entity.ts';
import type { SessionDto } from '../../dtos/session.dto.ts';
import { SessionEntity } from '../session.entity.ts';

export class SessionMapper {
  static toPersistence(domainEntity: SessionDto): SessionEntity {
    const persistenceSchema = new UserEntity();
    persistenceSchema.id = domainEntity.user.id;
    const sessionEntity = new SessionEntity();

    if (domainEntity.id && typeof domainEntity.id === 'string') {
      sessionEntity.id = domainEntity.id;
    }

    sessionEntity.user = persistenceSchema;
    sessionEntity.userId = domainEntity.userId;
    sessionEntity.hash = domainEntity.hash;
    sessionEntity.createdAt = domainEntity.createdAt;
    sessionEntity.updatedAt = domainEntity.updatedAt;

    return sessionEntity;
  }
}
