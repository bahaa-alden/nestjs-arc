import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequestRequiredPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException();
    }

    return value;
  }
}
