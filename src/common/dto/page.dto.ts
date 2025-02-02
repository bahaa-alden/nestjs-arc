import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { ClassField } from '../decorators/field.decorators.ts';
import { PageMetaDto } from './page-meta.dto.ts';
import { PageOptionsDto } from './page-options.dto.ts';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ClassField(() => PageMetaDto)
  readonly paginationMeta: PageMetaDto;

  @ApiHideProperty()
  readonly _pagination!: PageOptionsDto;

  constructor(data: T[], paginationMeta: PageMetaDto) {
    this.data = data;
    this.paginationMeta = paginationMeta;
  }
}
