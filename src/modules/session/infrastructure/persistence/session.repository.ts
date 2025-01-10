import type { UserDto } from '../../../user/dtos/user.dto';
import type { Session } from '../../domain/session';

export abstract class SessionRepository {
  abstract findById(id: Session['id']): Promise<Session | null>;

  abstract create(
    data: Omit<
      Session,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<Session>;

  abstract update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null>;

  abstract deleteById(id: Session['id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: UserDto['id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: UserDto['id'];
    excludeSessionId: Session['id'];
  }): Promise<void>;
}
