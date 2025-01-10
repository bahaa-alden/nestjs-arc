import { UserEntity } from '../../../../../user/user.entity.ts';
import { Session } from '../../../../domain/session.ts';
import { SessionEntity } from '../../../../session.entity.ts';

export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;

    if (raw.user) {
      domainEntity.user = raw.user.toDto();
    }

    domainEntity.userId = raw.userId;
    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Session): SessionEntity {
    const persistenceSchema = new UserEntity();
    persistenceSchema.id = domainEntity.userId;
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
