import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarEntity } from '../car.entity.ts';
import { CarTranslationEntity } from '../car-translation.entity.ts';
import { CreateCarCommand } from './create-car.command.ts';

@CommandHandler(CreateCarCommand)
export class CreateCarHandler
  implements ICommandHandler<CreateCarCommand, CarEntity>
{
  constructor(
    @InjectRepository(CarEntity)
    private carRepository: Repository<CarEntity>,
@InjectRepository(CarTranslationEntity)
private carTranslationRepository: Repository<CarTranslationEntity>,
) {}

async execute(command: CreateCarCommand) {
  const { createCarDto } = command;
  const entity = this.carRepository.create();
  const translations: CarTranslationEntity[] = [];

  await this.carRepository.save(entity);

  // FIXME: Create generic function for translation creation
  for (const createTranslationDto of createCarDto.title) {
    const languageCode = createTranslationDto.languageCode;
    const translationEntity = this.carTranslationRepository.create({
    carId: entity.id,
      languageCode,
      title: createTranslationDto.text,
      description: createCarDto.description.find(item => item.languageCode === languageCode)!.text,
  });

    translations.push(translationEntity);
  }

  await this.carTranslationRepository.save(translations);

  entity.translations = translations;

  return entity;
}
}
