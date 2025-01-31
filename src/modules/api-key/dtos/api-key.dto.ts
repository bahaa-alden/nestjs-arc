import { faker } from '@faker-js/faker';

import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  BooleanField,
  DateFieldOptional,
  EnumField,
  StringField,
} from '../../../common/decorators/field.decorators.ts';
import { ApiKeyType } from '../../../common/constants/api-key.enum.ts';
import { ApiKeyEntity } from '../repository/entities/api-key.entity.ts';

export type ApiKeyDtoOptions = Partial<{ secret: string }>;

export class ApiKeyDto extends AbstractDto {
  @StringField()
  hash?: string;

  @BooleanField({
    description: 'Active flag of api key',
    example: true,
    required: true,
    nullable: false,
  })
  isActive?: boolean;

  @DateFieldOptional({
    description: 'Api Key start date',
    example: faker.date.past(),
    nullable: true,
  })
  endDate?: Date | null;

  @DateFieldOptional({
    description: 'Api Key end date',
    example: faker.date.past(),
    nullable: true,
  })
  startDate?: Date | null;

  @StringField({
    description: 'Alias name of api key',
    example: faker.person.jobTitle(),
    required: true,
    nullable: false,
  })
  name?: string;

  @EnumField(() => ApiKeyType, {
    description: 'Type of api key',
    example: ApiKeyType.DEFAULT,
    required: true,
    nullable: false,
  })
  type?: ApiKeyType;

  @StringField({
    description: 'Unique key of api key',
    example: faker.string.alpha(15),
    required: true,
    nullable: false,
  })
  key?: string;

  @StringField({
    description: 'Secret of api key',
    example: faker.string.alpha(15),
    required: true,
    nullable: false,
  })
  secret?: string;

  constructor(apiKey: ApiKeyEntity, options?: ApiKeyDtoOptions) {
    super(apiKey);
    this.key = apiKey.key;
    this.isActive = apiKey.isActive;
    this.endDate = apiKey.endDate;
    this.startDate = apiKey.startDate;
    this.name = apiKey.name;

    this.type = apiKey.type;

    this.secret = options?.secret;
  }
}
