import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../common/abstract.entity.ts';
import { UseDto } from '../../../../common/decorators/use-dto.decorator.ts';
import { ApiKeyDto } from '../../dtos/api-key.dto.ts';
import { ApiKeyType } from '../../../../common/constants/api-key.enum.ts';

@Entity('api-key')
@UseDto(ApiKeyDto)
export class ApiKeyEntity extends AbstractEntity {
  @Column({
    enum: ApiKeyType,
    type: 'enum',
    default: ApiKeyType.DEFAULT,
  })
  type!: ApiKeyType;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  key!: string;

  @Column({
    type: 'varchar',
  })
  hash!: string;

  @Column({
    type: 'boolean',
  })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;
}
