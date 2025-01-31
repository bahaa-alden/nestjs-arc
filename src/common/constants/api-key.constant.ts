import { ApiKeyType } from './api-key.enum.ts';

export const API_KEY_DEFAULT_AVAILABLE_SEARCH = ['name', 'key'];
export const API_KEY_DEFAULT_IS_ACTIVE = [true, false];
export const API_KEY_DEFAULT_TYPE = Object.values(ApiKeyType);
export const API_KEY_X_TYPE_META_KEY = 'ApiKeyXTypeMetaKey';
