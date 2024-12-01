/* eslint-disable sonarjs/no-useless-intersection */
import type { Request } from 'express'; // Ensure ReqId is imported

import type { ApiKeyPayloadDto } from '../../../modules/api-key/dtos/api-key-payload.dto.ts';
import type { JwtPayloadType } from '../../../modules/auth/strategies/types/jwt-payload.type.ts';

export interface IRequestApp<T = JwtPayloadType, B = ApiKeyPayloadDto>
  extends Request {
  __pagination: any;
  __language: any;
  __version: string | undefined;
  apiKey?: B;
  user?: T & Express.User;
}
