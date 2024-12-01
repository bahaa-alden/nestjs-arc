import type { SessionDto } from '../../../session/dtos/session.dto';

export interface IJwtRefreshPayloadType {
  sessionId: SessionDto['id'];
  hash: SessionDto['hash'];
  iat: number;
  exp: number;
}
