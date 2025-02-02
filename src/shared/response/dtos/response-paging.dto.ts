/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { Order } from '../../../common/constants/order.ts';
import { ClassField } from '../../../common/decorators/field.decorators.ts';
import { PageMetaDto } from '../../../common/dto/page-meta.dto.ts';
import { PageOptionsDto } from '../../../common/dto/page-options.dto.ts';
import { ResponseDto, ResponseMetadataDto } from './response.dto.ts';

export class ResponsePagingMetadataPaginationRequestDto extends PageOptionsDto {
  @ApiProperty({
    required: true,
    nullable: false,
    example: ['name'],
  })
  availableSearch!: string[];
}

export class ResponsePagingMetadataDto extends ResponseMetadataDto {
  @ApiProperty({
    required: false,
    type: ResponsePagingMetadataPaginationRequestDto,
  })
  pagination?: ResponsePagingMetadataPaginationRequestDto;
}

export class ResponsePagingDto extends PickType(ResponseDto, [
  'statusCode',
] as const) {
  @ApiProperty({
    name: '_metadata',
    required: true,
    nullable: false,
    description: 'Contain metadata about API',
    type: ResponsePagingMetadataDto,
    example: {
      language: 'en',
      timestamp: 1_660_190_937_231,
      timezone: 'Asia/Dubai',
      path: '/api/v1/test/hello',
      version: '1',
      pagination: {
        q: faker.person.fullName(),
        page: 1,
        take: 10,
        order: Order.ASC,
        availableSearch: ['name', 'email'],
      },
    },
  })
  _metadata!: ResponsePagingMetadataDto;

  @ClassField(() => PageMetaDto)
  paginationMeta!: PageMetaDto;

  @ApiProperty({
    required: true,
    isArray: true,
  })
  data!: Array<Record<string, any>>;
}
