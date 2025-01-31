import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ApiKeyDto } from '../../modules/api-key/dtos/api-key.dto.ts';
import { HelperDateService } from '../../shared/helper/services/helper-date.service.ts';
import { ApiKeyStatusCodeError } from '../constants/api-key-status-code.enum.ts';

@Injectable()
export class ApiKeyNotExpiredPipe implements PipeTransform {
  constructor(private readonly helperDateService: HelperDateService) {}

  transform(value: ApiKeyDto): ApiKeyDto {
    const today: Date = this.helperDateService.create();

    if (value.startDate && value.endDate && today > value.endDate) {
      throw new BadRequestException({
        statusCode: ApiKeyStatusCodeError.EXPIRED,
        message: 'apiKey.error.expired',
      });
    }

    return value;
  }
}
