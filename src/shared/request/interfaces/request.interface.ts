import type { Request } from 'express';

import type { ApiKeyPayloadDto } from '../../../modules/api-key/dtos/api-key-payload.dto';
import type { JwtPayloadType } from '../../../modules/auth/strategies/types/jwt-payload.type';

export interface IRequestApp<T = JwtPayloadType, B = ApiKeyPayloadDto>
  extends Request {
  apiKey?: B;
  user?: T & Express.User;
}
