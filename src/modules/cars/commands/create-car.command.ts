import type { ICommand } from '@nestjs/cqrs';

import type { CreateCarDto } from '../dto/create-car.dto.ts';

export class CreateCarCommand implements ICommand {
  constructor(
    public readonly createCarDto: CreateCarDto,
) {}
}
