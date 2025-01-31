import { faker } from '@faker-js/faker';

import { StringField } from '../../../../common/decorators/field.decorators.ts';

export class ApiKeyUpdateRequestDto {
  @StringField({
    description: 'Api Key name',
    example: faker.company.name(),
    required: true,
    maxLength: 100,
  })
  name!: string;
}
