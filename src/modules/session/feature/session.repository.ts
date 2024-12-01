import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UserDto } from '../../user/dtos/user.dto.ts';
import { SessionDto } from '../dtos/session.dto.ts';
import { SessionRepository } from '../interfaces/session.repository.ts';
import { SessionMapper } from './mappers/session.mapper.ts';
import { SessionEntity } from './session.entity.ts';

@Injectable()
export class SessionFeatureRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepo: Repository<SessionEntity>,
  ) {}

  async findById(id: SessionDto['id']): Promise<SessionDto | null> {
    const sessionObject = await this.sessionRepo.findOneBy({ id });

    return sessionObject ? sessionObject.toDto() : null;
  }

  async create(data: SessionDto): Promise<SessionDto> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = this.sessionRepo.create(persistenceModel);
    const sessionObject = await this.sessionRepo.save(createdSession);

    return sessionObject.toDto();
  }

  async update(
    id: SessionDto['id'],
    payload: Partial<SessionDto>,
  ): Promise<SessionDto | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;
    delete clonedPayload.createdAt;
    delete clonedPayload.updatedAt;

    const filter = { id };
    const sessionEntity = await this.findById(id);

    if (!sessionEntity) {
      throw new UnauthorizedException();
    }

    const sessionObject = await this.sessionRepo.update(filter, {
      ...sessionEntity,
      ...clonedPayload,
    });

    let updateSession = null;

    if (sessionObject.affected && sessionObject.affected > 1) {
      updateSession = await this.findById(filter.id);
    }

    return updateSession;
  }

  async deleteById(id: SessionDto['id']): Promise<void> {
    await this.sessionRepo.softRemove({ id });
  }

  async deleteByUserId({ userId }: { userId: UserDto['id'] }): Promise<void> {
    await this.sessionRepo.update({ userId }, { deletedAt: new Date() });
  }

  async deleteByUserIdWithExclude({
    userId,
    excludeSessionId,
  }: {
    userId: UserDto['id'];
    excludeSessionId: SessionDto['id'];
  }): Promise<void> {
    await this.sessionRepo.update(
      {
        userId,
        id: Not(excludeSessionId),
      },
      { deletedAt: new Date() }, // Set the deletedAt column for soft delete
    );
  }
}
