import { PickType } from '@nestjs/swagger';

import { ApiKeyDto } from './api-key.dto.ts';

export class ApiKeyPayloadDto extends PickType(ApiKeyDto, [
  'id',
  'name',
  'type',
  'key',
] as const) {}
