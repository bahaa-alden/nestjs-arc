import { Injectable } from '@nestjs/common';
import type {
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

import { HelperStringService } from '../../helper/services/helper-string.service.ts';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string): boolean {
    return value
      ? this.helperStringService.checkPasswordStrength(value)
      : false;
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
