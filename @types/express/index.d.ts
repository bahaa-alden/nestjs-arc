import { ApiKeyPayloadDto } from './../../src/modules/api-key/dtos/api-key-payload.dto.ts';
import { JwtPayloadType } from './../../src/modules/auth/strategies/types/jwt-payload.type';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string; // Assuming the ID is a string from middleware like express-request-id
    apiKey?: ApiKeyPayloadDto;
    user?: JwtPayloadType & Express.User;
  }
}
