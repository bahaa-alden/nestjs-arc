import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ApiKeyDto } from '../../modules/api-key/dtos/api-key.dto.ts';
import { ApiKeyStatusCodeError } from '../constants/api-key-status-code.enum.ts';
@Injectable()
export class ApiKeyIsActivePipe implements PipeTransform {
  private readonly isActive: boolean[];

  constructor(isActive: boolean[]) {
    this.isActive = isActive;
  }

  transform(value: ApiKeyDto): ApiKeyDto {
    if (!this.isActive.includes(value.isActive!)) {
      throw new BadRequestException({
        statusCode: ApiKeyStatusCodeError.IS_ACTIVE,
        message: 'apiKey.error.isActiveInvalid',
      });
    }

    return value;
  }
}
