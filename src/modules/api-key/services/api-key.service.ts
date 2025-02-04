import { Injectable } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import { HelperDateDayOf } from '../../../common/constants/helper.enum.ts';
import { PageDto } from '../../../common/dto/page.dto.ts';
import { needRecord } from '../../../common/utils.ts';
import { HelperDateService } from '../../../shared/helper/services/helper-date.service.ts';
import { HelperHashService } from '../../../shared/helper/services/helper-hash.service.ts';
import { HelperStringService } from '../../../shared/helper/services/helper-string.service.ts';
import { ApiConfigService } from '../../../shared/services/api-config.service.ts';
import { ApiKeyDto } from '../dtos/api-key.dto.ts';
import { ApiKeysPageOptionsDto } from '../dtos/api-key-page.dto.ts';
import { ApiKeyCreateRawRequestDto } from '../dtos/request/api-key-create-request.dto.ts';
import { ApiKeyUpdateDateRequestDto } from '../dtos/request/api-key-update-date-request.dto.ts';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key-update-request.dto.ts';
import { ApiKeyEntity } from '../repository/entities/api-key.entity.ts';
import { ApiKeyRepository } from '../repository/repositories/api-key.repository.ts';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly helperStringService: HelperStringService,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async findAll(
    pageOptionsDto: ApiKeysPageOptionsDto,
  ): Promise<PageDto<ApiKeyDto>> {
    return this.apiKeyRepository.findAll(pageOptionsDto);
  }

  async findOneById(id: Uuid): Promise<ApiKeyDto> {
    const entity = needRecord(await this.apiKeyRepository.findOneById(id));

    return entity.toDto();
  }

  async findOne(
    where:
      | FindOptionsWhere<ApiKeyEntity>
      | Array<FindOptionsWhere<ApiKeyEntity>>,
  ): Promise<ApiKeyDto> {
    const entity = needRecord(await this.apiKeyRepository.findOneBy(where));

    return entity.toDto();
  }

  async findOneByKey(key: string): Promise<ApiKeyDto> {
    const entity = needRecord(await this.apiKeyRepository.findOneBy({ key }));

    return entity.toDto();
  }

  async findOneByActiveKey(key: string): Promise<ApiKeyEntity | null> {
    const entity = await this.apiKeyRepository.findOneBy({
      key,
      isActive: true,
    });

    return entity;
  }

  async getTotal(
    where:
      | FindOptionsWhere<ApiKeyEntity>
      | Array<FindOptionsWhere<ApiKeyEntity>>,
  ): Promise<number> {
    const count = await this.apiKeyRepository.countBy(where);

    return count;
  }

  async create({
    name,
    type,
    startDate,
    endDate,
  }: ApiKeyCreateRawRequestDto): Promise<Partial<ApiKeyDto>> {
    const key = this.createKey();
    const secret = this.createSecret();
    const hash: string = this.createHashApiKey(key, secret);

    const data: ApiKeyEntity = new ApiKeyEntity();
    data.name = name;
    data.key = key;
    data.hash = hash;
    data.isActive = true;
    data.type = type;

    if (startDate && endDate) {
      data.startDate = this.helperDateService.create(startDate, {
        dayOf: HelperDateDayOf.START,
      });

      data.endDate = this.helperDateService.create(endDate, {
        dayOf: HelperDateDayOf.END,
      });
    }

    const created: ApiKeyDto = await this.apiKeyRepository.createOne(data);

    return { id: created.id, key: created.key, secret };
  }

  async active(entity: ApiKeyEntity): Promise<ApiKeyDto> {
    entity.isActive = true;
    const updated = await this.apiKeyRepository.save(entity);

    return updated.toDto();
  }

  async inactive(entity: ApiKeyEntity): Promise<ApiKeyDto> {
    entity.isActive = false;
    const updated = await this.apiKeyRepository.save(entity);

    return updated.toDto();
  }

  async update(
    entity: ApiKeyEntity,
    { name }: ApiKeyUpdateRequestDto,
  ): Promise<ApiKeyDto> {
    entity.name = name;
    const updated = await this.apiKeyRepository.save(entity);

    return updated.toDto();
  }

  async updateDate(
    entity: ApiKeyEntity,
    { startDate, endDate }: ApiKeyUpdateDateRequestDto,
  ): Promise<ApiKeyDto> {
    entity.startDate = this.helperDateService.create(startDate, {
      dayOf: HelperDateDayOf.START,
    });
    entity.endDate = this.helperDateService.create(endDate, {
      dayOf: HelperDateDayOf.END,
    });

    const updated = await this.apiKeyRepository.save(entity);

    return updated.toDto();
  }

  async reset(entity: ApiKeyEntity): Promise<Partial<ApiKeyDto>> {
    const secret: string = this.createSecret();
    const hash: string = this.createHashApiKey(entity.key, secret);

    entity.hash = hash;

    const updated = await this.apiKeyRepository.save(entity);

    return { id: updated.id, key: updated.key, secret };
  }

  async delete(entity: ApiKeyEntity): Promise<ApiKeyDto> {
    return this.apiKeyRepository.delete(entity.id);
  }

  validateHashApiKey(hashFromRequest: string, hash: string): boolean {
    return this.helperHashService.sha256Compare(hashFromRequest, hash);
  }

  createKey(): string {
    const random: string = this.helperStringService.random(25);

    return `${this.apiConfig.nodeEnv}_${random}`;
  }

  createSecret(): string {
    return this.helperStringService.random(35);
  }

  createHashApiKey(key: string, secret: string): string {
    return this.helperHashService.sha256(`${key}:${secret}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteMany(where: Record<string, any>): Promise<boolean> {
    await this.apiKeyRepository.delete(where);

    return true;
  }

  // async inactiveManyByEndDate(): Promise<boolean> {
  //   const today = this.helperDateService.create();
  //   await this.apiKeyRepository.updateMany(
  //     {
  //       endDate: {
  //         $lte: today,
  //       },
  //       isActive: true,
  //     },
  //     {
  //       isActive: false,
  //     },
  //     options,
  //   );

  //   return true;
  // }
}
