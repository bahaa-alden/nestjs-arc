import { faker } from '@faker-js/faker';
import { IntersectionType, PartialType } from '@nestjs/swagger';

import {
  EnumField,
  StringField,
} from '../../../../common/decorators/field.decorators.ts';
import { ApiKeyType } from '../../../../common/constants/api-key.enum.ts';
import { ApiKeyUpdateDateRequestDto } from './api-key-update-date-request.dto.ts';
import { ApiKeyUpdateRequestDto } from './api-key-update-request.dto.ts';

class ApiKeyCreateRequestDto extends IntersectionType(
  ApiKeyUpdateRequestDto,
  PartialType(ApiKeyUpdateDateRequestDto),
) {
  @EnumField(() => ApiKeyType, {
    description: 'Api Key name',
    example: ApiKeyType.DEFAULT,
    required: true,
  })
  type!: ApiKeyType;
}

export class ApiKeyCreateRawRequestDto extends ApiKeyCreateRequestDto {
  @StringField({
    name: 'key',
    example: faker.string.alphanumeric(10),
    required: true,
    nullable: false,
    maxLength: 50,
  })
  key!: string;

  @StringField({
    name: 'secret',
    example: faker.string.alphanumeric(20),
    required: true,
    nullable: false,
    maxLength: 100,
  })
  secret!: string;
}
