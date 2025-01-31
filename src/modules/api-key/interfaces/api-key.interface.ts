import type { ApiKeyType } from '../../../common/constants/api-key.enum';

export interface IApiKeyPayload {
  _id: string;
  key: string;
  type: ApiKeyType;
}
