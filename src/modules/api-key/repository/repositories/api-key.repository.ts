import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { PageDto } from '../../../../common/dto/page.dto.ts';
import { ApiKeyDto } from '../../dtos/api-key.dto.ts';
import { ApiKeysPageOptionsDto } from '../../dtos/api-key-page.dto.ts';
import { ApiKeyEntity } from '../entities/api-key.entity.ts';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity) private repo: Repository<ApiKeyEntity>,
  ) {}

  async findAll(
    pageOptionsDto: ApiKeysPageOptionsDto,
  ): Promise<PageDto<ApiKeyDto>> {
    const queryBuilder = this.repo.createQueryBuilder('apiKey');

    if (pageOptionsDto.q) {
      queryBuilder.searchByString(pageOptionsDto.q, ['name']);
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  createOne(entityLike: ApiKeyEntity): Promise<ApiKeyEntity> {
    const entity = this.repo.create(entityLike);

    return this.repo.save(entity);
  }

  findOneById(id: Uuid): Promise<ApiKeyEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async findOneBy(
    where:
      | FindOptionsWhere<ApiKeyEntity>
      | Array<FindOptionsWhere<ApiKeyEntity>>,
  ): Promise<ApiKeyEntity | null> {
    return this.repo.findOneBy(where);
  }

  countBy(
    where:
      | FindOptionsWhere<ApiKeyEntity>
      | Array<FindOptionsWhere<ApiKeyEntity>>,
  ) {
    return this.repo.countBy(where);
  }

  save(entity: ApiKeyEntity) {
    return this.repo.save(entity);
  }

  delete(id: Uuid | Record<string, any>) {
    return this.repo.softRemove({ id });
  }
}
