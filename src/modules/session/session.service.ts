import { Injectable } from '@nestjs/common';

import { UserDto } from '../user/dtos/user.dto.ts';
import { SessionDto } from './dtos/session.dto.ts';
import { SessionRepository } from './interfaces/session.repository.ts';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: SessionDto['id']): Promise<SessionDto | null> {
    return this.sessionRepository.findById(id);
  }

  create(
    data: Omit<
      SessionDto,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<SessionDto> {
    return this.sessionRepository.create(data);
  }

  update(
    id: SessionDto['id'],
    payload: Partial<
      Omit<SessionDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<SessionDto | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(id: SessionDto['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByUserId(conditions: { userId: UserDto['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }

  deleteByUserIdWithExclude(conditions: {
    userId: UserDto['id'];
    excludeSessionId: SessionDto['id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }
}
