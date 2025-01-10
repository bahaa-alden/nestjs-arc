import { Injectable } from '@nestjs/common';

import { UserDto } from '../user/dtos/user.dto.ts';
import { Session } from './domain/session.ts';
import { SessionRepository } from './infrastructure/persistence/session.repository.ts';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: Session['id']): Promise<Session | null> {
    return this.sessionRepository.findById(id);
  }

  create(
    data: Omit<
      Session,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByUserId(conditions: { userId: UserDto['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }

  deleteByUserIdWithExclude(conditions: {
    userId: UserDto['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }
}
