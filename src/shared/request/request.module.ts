import { DynamicModule, Module } from '@nestjs/common';

import {
  DateLessThanConstraint,
  DateLessThanEqualConstraint,
} from './validations/request.date-less-than.validation';
import { IsExistConstraint } from './validations/request.exists.validation';
import {
  GreaterThanEqualOtherPropertyConstraint,
  GreaterThanOtherPropertyConstraint,
} from './validations/request.greater-than-other-property.validation';
import {
  LessThanEqualOtherPropertyConstraint,
  LessThanOtherPropertyConstraint,
} from './validations/request.less-than-other-property.validation';
import { IsUniqueConstraint } from './validations/request.unique.validation';
import {
  DateGreaterThanConstraint,
  DateGreaterThanEqualConstraint,
} from './validations/request-date-greater-than.validation';
import { IsPasswordConstraint } from './validations/request-is-password.validation';

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
