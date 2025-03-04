import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  DynamicTranslate,
  StaticTranslate,
} from '../../../common/decorators/translate.decorator.ts';
import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import type { PostEntity } from '../post.entity.ts';
import { PostTranslationDto } from './post-translation.dto.ts';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  @DynamicTranslate()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  @ApiPropertyOptional({ type: PostTranslationDto, isArray: true })
  declare translations?: PostTranslationDto[];

  constructor(postEntity: PostEntity) {
    super(postEntity);

    this.info = 'keywords.admin';
  }
}
