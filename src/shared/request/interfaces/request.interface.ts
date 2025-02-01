import type { Request } from 'express'; // Ensure ReqId is imported

import type { ApiKeyPayloadDto } from '../../../modules/api-key/dtos/api-key-payload.dto.ts';
import type { JwtPayloadType } from '../../../modules/auth/strategies/types/jwt-payload.type.ts';

export interface IRequestApp<T = JwtPayloadType, B = ApiKeyPayloadDto>
  extends Request {
  apiKey?: B;
  user?: T & Express.User;
}
