import type { Relation } from 'typeorm';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity.ts';
import { UseDto } from '../../../common/decorators/use-dto.decorator.ts';
import { UserEntity } from '../../user/user.entity.ts';
import { SessionDto } from '../dtos/session.dto.ts';

@Entity({ name: 'sessions' })
@UseDto(SessionDto)
export class SessionEntity extends AbstractEntity<SessionDto> {
  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user!: Relation<UserEntity>;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId!: Uuid;

  @Column({ type: 'varchar', nullable: false })
  hash!: string;
}
