import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetCarQuery } from './get-car.query.ts';
import { CarEntity } from '../car.entity.ts';

@QueryHandler(GetCarQuery)
export class GetCarHandler implements IQueryHandler<GetCarQuery> {
  constructor(
    @InjectRepository(CarEntity)
    private carRepository: Repository<CarEntity>,
  ) {}

async execute(query: GetCarQuery) {
  return this.carRepository.find({
    userId: query.userId,
  });
}
}
