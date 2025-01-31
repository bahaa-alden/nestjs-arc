/* eslint-disable no-prototype-builtins */
import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

import type { IValidationError } from '../../../common/interfaces/IValidationError';

function consOrChild(
  error: ValidationError,
  formattedErrors: IValidationError[],
  father?: string[],
) {
  const { property, constraints, children } = error;

  if (constraints) {
    for (const key in constraints) {
      if (constraints.hasOwnProperty(key)) {
        formattedErrors.push({
          message: constraints[key]!,
          path: father ? [...father, property] : [property],
        });
      }
    }

    return formattedErrors;
  }

  father = father ?? [];
  father.push(property);

  for (const object of children!) {
    consOrChild(object, formattedErrors, father);
  }

  return formattedErrors;
}

export const errorsFormat = (errors: ValidationError[]) => {
  const formattedErrors: IValidationError[] = [];

  for (const error of errors) {
    consOrChild(error, formattedErrors);
  }

  throw new BadRequestException({ errors: formattedErrors });
};
