import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractTranslationEntity } from '../../common/abstract.entity.ts';
import { CarTranslationDto } from './dto/car-translation.dto.ts';
import { CarEntity } from './car.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';

@Entity({ name: 'cars_translations' })
@UseDto(CarTranslationDto)
export class CarTranslationEntity extends AbstractTranslationEntity<CarTranslationDto> {
  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'uuid' })
  carId!: Uuid;

  @ManyToOne(() => CarEntity, (entity) => entity.translations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'car_id' })
  car!: Relation<CarEntity>;
}
