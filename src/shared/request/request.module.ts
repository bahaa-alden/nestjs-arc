import { DynamicModule, Module } from '@nestjs/common';

import {
  DateGreaterThanConstraint,
  DateGreaterThanEqualConstraint,
} from './validations/request-date-greater-than.validation.ts';
import {
  DateLessThanConstraint,
  DateLessThanEqualConstraint,
} from './validations/request-date-less-than.validation.ts';
import { IsExistConstraint } from './validations/request-exists.validation.ts';
import {
  GreaterThanEqualOtherPropertyConstraint,
  GreaterThanOtherPropertyConstraint,
} from './validations/request-greater-than-other-property.validation.ts';
import { IsPasswordConstraint } from './validations/request-is-password.validation.ts';
import {
  LessThanEqualOtherPropertyConstraint,
  LessThanOtherPropertyConstraint,
} from './validations/request-less-than-other-property.validation.ts';
import { IsUniqueConstraint } from './validations/request-unique.validation.ts';

@Module({})
export class RequestModule {
  static forRoot(): DynamicModule {
    return {
      module: RequestModule,
      controllers: [],
      providers: [
        DateGreaterThanEqualConstraint,
        DateGreaterThanConstraint,
        DateLessThanEqualConstraint,
        DateLessThanConstraint,
        GreaterThanEqualOtherPropertyConstraint,
        GreaterThanOtherPropertyConstraint,
        IsPasswordConstraint,
        LessThanEqualOtherPropertyConstraint,
        LessThanOtherPropertyConstraint,
        IsUniqueConstraint,
        IsExistConstraint,
      ],
      imports: [],
    };
  }
}
