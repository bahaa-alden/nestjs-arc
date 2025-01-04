import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateCarDto } from './dto/create-car.dto.ts';
import type { CarDto } from './dto/car.dto.ts';
import { CarPageOptionsDto } from './dto/car-page-options.dto.ts';
import { UpdateCarDto } from './dto/update-car.dto.ts';
import { CarService } from './car.service.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';

@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}

@Post()
@Auth([])
@HttpCode(HttpStatus.CREATED)
async createCar(@Body() createCarDto: CreateCarDto) {
  const entity = await this.carService.createCar(createCarDto);

  return entity.toDto();
}

@Get()
@Auth([])
@HttpCode(HttpStatus.OK)
getCars(@Query() carPageOptionsDto: CarPageOptionsDto): Promise<PageDto<CarDto>> {
  return this.carService.getCars(carPageOptionsDto);
}

@Get(':id')
@Auth([])
@HttpCode(HttpStatus.OK)
async getCar(@UUIDParam('id') id: Uuid): Promise<CarDto> {
  const entity = await this.carService.getCar(id);

  return entity.toDto();
}

@Put(':id')
@HttpCode(HttpStatus.ACCEPTED)
updateCar(
@UUIDParam('id') id: Uuid,
  @Body() updateCarDto: UpdateCarDto,
): Promise<void> {
  return this.carService.updateCar(id, updateCarDto);
}

@Delete(':id')
@HttpCode(HttpStatus.ACCEPTED)
async deleteCar(@UUIDParam('id') id: Uuid): Promise<void> {
  await this.carService.deleteCar(id);
}
}
