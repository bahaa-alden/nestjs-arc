import { faker } from '@faker-js/faker';

import { ApiKeyType } from '../../../common/constants/api-key.enum.ts';

export const apiKeyDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const apiKeyDocQueryType = [
  {
    name: 'type',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ApiKeyType).join(','),
    description: "boolean value with ',' delimiter",
  },
];

export const apiKeyDocParamsId = [
  {
    name: 'apiKey',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];
