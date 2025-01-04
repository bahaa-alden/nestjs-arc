import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { CreateCarCommand } from './commands/create-car.command.ts';
import type { CarDto } from './dto/car.dto.ts';
import type { CarPageOptionsDto } from './dto/car-page-options.dto.ts';
import { CarNotFoundException } from './exceptions/car-not-found.exception.ts';
import { CarEntity } from './car.entity.ts';
import { CreateCarDto } from './dto/create-car.dto.ts';
import type { UpdateCarDto } from './dto/update-car.dto.ts';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private carRepository: Repository<CarEntity>,
  private commandBus: CommandBus,
) {}

@Transactional()
createCar(createCarDto: CreateCarDto): Promise<CarEntity> {
  return this.commandBus.execute<CreateCarCommand, CarEntity>(
  new CreateCarCommand(createCarDto),
);
}

async getCars(
  carPageOptionsDto: CarPageOptionsDto,
): Promise<PageDto<CarDto>> {
  const queryBuilder = this.carRepository
  .createQueryBuilder('cars')
    .leftJoinAndSelect('cars.translations', 'carsTranslation');
  const [items, pageMetaDto] = await queryBuilder.paginate(carPageOptionsDto);

  return items.toPageDto(pageMetaDto);
}

async getCar(id: Uuid): Promise<CarEntity> {
  const queryBuilder = this.carRepository
  .createQueryBuilder('cars')
    .where('cars.id = :id', { id });

  const entity = await queryBuilder.getOne();

if (!entity) {
  throw new CarNotFoundException();
}

return entity;
}

async updateCar(
  id: Uuid,
  updateCarDto: UpdateCarDto,
): Promise<void> {
  const queryBuilder = this.carRepository
  .createQueryBuilder('cars')
    .where('cars.id = :id', { id });

  const entity = await queryBuilder.getOne();

if (!entity) {
  throw new CarNotFoundException();
}

this.carRepository.merge(entity, updateCarDto);

await this.carRepository.save(updateCarDto);
}

async deleteCar(id: Uuid): Promise<void> {
  const queryBuilder = this.carRepository
  .createQueryBuilder('cars')
    .where('cars.id = :id', { id });

  const entity = await queryBuilder.getOne();

if (!entity) {
  throw new CarNotFoundException();
}

await this.carRepository.remove(entity);
}
}
