import {
  StringField,
  UUIDField,
} from '../../../common/decorators/field.decorators.ts';
import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import type { UserDto } from '../../user/dtos/user.dto';
import { SessionEntity } from '../feature/session.entity.ts';

export class SessionDto extends AbstractDto {
  user!: UserDto;

  @UUIDField()
  userId!: Uuid;

  @StringField()
  hash!: string;

  constructor(session: SessionEntity, _options: Record<string, unknown>) {
    super(session);
    this.userId = session.userId;
    this.hash = session.hash;
    this.user = session.user.toDto();
    console.log(this);
  }
}
