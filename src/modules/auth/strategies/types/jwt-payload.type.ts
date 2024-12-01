import type { SessionDto } from '../../../session/dtos/session.dto';
import type { UserDto } from '../../../user/dtos/user.dto';

export type JwtPayloadType = Pick<UserDto, 'id' | 'role'> & {
  sessionId: SessionDto['id'];
  iat: number;
  exp: number;
};
