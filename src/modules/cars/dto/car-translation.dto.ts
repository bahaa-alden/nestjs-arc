import { AbstractTranslationDto } from '../../../common/dto/abstract.dto.ts';
import type { CarTranslationEntity } from '../car-translation.entity.ts';
import { LanguageCode } from '../../../constants/language-code.ts';
import { EnumField } from '../../../decorators/field.decorators.ts';

export class CarTranslationDto extends AbstractTranslationDto {
@EnumField(() => LanguageCode)
  languageCode: LanguageCode;

  constructor(carTranslationEntity: CarTranslationEntity) {
    super(carTranslationEntity);

    this.languageCode = carTranslationEntity.languageCode;
  }
}
