import { Injectable, PipeTransform } from '@nestjs/common';

import { ApiKeyDto } from '../../modules/api-key/dtos/api-key.dto.ts';
import { ApiKeyService } from '../../modules/api-key/services/api-key.service.ts';

@Injectable()
export class ApiKeyParsePipe implements PipeTransform {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async transform(value: Uuid): Promise<ApiKeyDto> {
    const apiKey = await this.apiKeyService.findOneById(value);

    return apiKey;
  }
}
