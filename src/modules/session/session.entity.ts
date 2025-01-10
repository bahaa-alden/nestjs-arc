import type { Relation } from 'typeorm';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UserEntity } from '../user/user.entity.ts';
import { Session } from './domain/session.ts';

@Entity({ name: 'sessions' })
export class SessionEntity extends AbstractEntity<Session> {
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
