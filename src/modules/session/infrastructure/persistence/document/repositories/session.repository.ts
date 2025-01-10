import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UserDto } from '../../../../../user/dtos/user.dto.ts';
import { Session } from '../../../../domain/session.ts';
import { SessionEntity } from '../../../../session.entity.ts';
import { SessionRepository } from '../../session.repository.ts';
import { SessionMapper } from '../mappers/session.mapper.ts';

@Injectable()
export class SessionDocumentRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionModel: Repository<SessionEntity>,
  ) {}

  async findById(id: Session['id']): Promise<Session | null> {
    const sessionObject = await this.sessionModel.findOneBy({ id });

    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = this.sessionModel.create(persistenceModel);
    const sessionObject = await this.sessionModel.save(createdSession);

    return SessionMapper.toDomain(sessionObject);
  }

  async update(
    id: Session['id'],
    payload: Partial<Session>,
  ): Promise<Session | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;
    delete clonedPayload.createdAt;
    delete clonedPayload.updatedAt;

    const filter = { id };
    const session = await this.sessionModel.findOneBy(filter);

    if (!session) {
      return null;
    }

    const sessionObject = await this.sessionModel.update(
      filter,
      SessionMapper.toPersistence({
        ...SessionMapper.toDomain(session),
        ...clonedPayload,
      }),
    );

    let updateSession = null;

    if (sessionObject.affected && sessionObject.affected > 1) {
      updateSession = await this.findById(filter.id);
    }

    return updateSession;
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.sessionModel.softRemove({ id });
  }

  async deleteByUserId({ userId }: { userId: UserDto['id'] }): Promise<void> {
    await this.sessionModel.update({ userId }, { deletedAt: new Date() });
  }

  async deleteByUserIdWithExclude({
    userId,
    excludeSessionId,
  }: {
    userId: UserDto['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    await this.sessionModel.update(
      {
        userId,
        id: Not(excludeSessionId),
      },
      { deletedAt: new Date() }, // Set the deletedAt column for soft delete
    );
  }
}
