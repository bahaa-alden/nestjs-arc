import type { Session } from '../../../session/domain/session';
import type { UserDto } from '../../../user/dtos/user.dto';

export type JwtPayloadType = Pick<UserDto, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
