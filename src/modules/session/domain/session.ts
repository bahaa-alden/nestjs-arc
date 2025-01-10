import type { UserDto } from '../../user/dtos/user.dto';

export class Session {
  id!: Uuid;

  user!: UserDto;

  userId!: Uuid;

  hash!: string;

  createdAt!: Date;

  updatedAt!: Date;
}
