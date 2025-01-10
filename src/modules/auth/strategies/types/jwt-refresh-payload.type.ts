import type { Session } from '../../../session/domain/session';

export interface IJwtRefreshPayloadType {
  sessionId: Session['id'];
  hash: Session['hash'];
  iat: number;
  exp: number;
}
