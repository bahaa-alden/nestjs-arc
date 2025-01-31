import { faker } from '@faker-js/faker';
import { IsNotEmpty } from 'class-validator';

import { DateField } from '../../../../common/decorators/field.decorators.ts';
import { DateGreaterThanEqual } from '../../../../shared/request/validations/request-date-greater-than.validation.ts';
import { GreaterThanEqualOtherProperty } from '../../../../shared/request/validations/request.greater-than-other-property.validation.ts';

export class ApiKeyUpdateDateRequestDto {
  @DateField({
    description: 'Api Key start date',
    example: faker.date.recent(),
    required: false,
    nullable: true,
  })
  // @IsISO8601()
  @DateGreaterThanEqual(new Date())
  startDate!: Date;

  @DateField({
    description: 'Api Key end date',
    example: faker.date.future(),
    required: false,
    nullable: true,
  })
  @IsNotEmpty()
  // @IsISO8601()
  @GreaterThanEqualOtherProperty('startDate')
  endDate!: Date;
}
