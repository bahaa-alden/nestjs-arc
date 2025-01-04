import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateCarHandler } from './commands/create-car.handler.ts';
import { CarController } from './car.controller.ts';
import { CarEntity } from './car.entity.ts';
import { CarTranslationEntity } from './car-translation.entity.ts';
import { CarService } from './car.service.ts';
import { GetCarHandler } from './queries/get-car.handler.ts';

const handlers = [
  CreateCarHandler,
  GetCarHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([CarEntity, CarTranslationEntity]),
  ],
  providers: [CarService, ...handlers],
  controllers: [CarController],
})
export class CarModule {}
