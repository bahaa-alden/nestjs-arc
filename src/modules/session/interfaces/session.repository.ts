import type { UserDto } from '../../user/dtos/user.dto';
import type { SessionDto } from '../dtos/session.dto';

export abstract class SessionRepository {
  abstract findById(id: SessionDto['id']): Promise<SessionDto | null>;

  abstract create(
    data: Omit<
      SessionDto,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<SessionDto>;

  abstract update(
    id: SessionDto['id'],
    payload: Partial<
      Omit<SessionDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<SessionDto | null>;

  abstract deleteById(id: SessionDto['id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: UserDto['id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: UserDto['id'];
    excludeSessionId: SessionDto['id'];
  }): Promise<void>;
}
