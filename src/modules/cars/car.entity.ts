import type { Relation } from 'typeorm';
import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { CarDto, ICarDtoOptions } from './dto/car.dto.ts';
import { CarTranslationEntity } from './car-translation.entity.ts';

@Entity({ name: 'cars' })
@UseDto(CarDto)
export class CarEntity extends AbstractEntity<CarDto, ICarDtoOptions> {
  @OneToMany(
    () => CarTranslationEntity,
    (carTranslationEntity) => carTranslationEntity.carId,
  )
  declare translations: Relation<CarTranslationEntity[]>;
}
