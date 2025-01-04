import { NotFoundException } from '@nestjs/common';

export class CarNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.CarNotFoundException', error);
  }
}
