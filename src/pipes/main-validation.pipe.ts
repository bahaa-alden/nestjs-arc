import { Injectable, ValidationPipe } from '@nestjs/common';

import { errorsFormat } from '../helpers/errors-format.helper.ts';

@Injectable()
export class MainValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors) => {
        errorsFormat(errors);
      },
    });
  }
}
