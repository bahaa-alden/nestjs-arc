/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { HelperPhotoService } from '../../shared/helper/services/helper-photo.service.ts';
import type { IFile } from '../interfaces/IFile.ts';

@Injectable()
export class SharpPipe
  implements PipeTransform<IFile, Promise<string | string[]>>
{
  constructor(private helperPhotoService: HelperPhotoService) {}

  async transform(
    image: IFile & { photos: IFile[] },
  ): Promise<string | string[]> {
    if (!image) {
      throw new BadRequestException('Please upload at least one photo');
    }

    if (Array.isArray(image.photos)) {
      const { photos }: { photos: IFile[] } = image;

      return Promise.all(
        photos.map((e) => this.helperPhotoService.customize(e)),
      );
    }

    return this.helperPhotoService.customize(image);
  }
}
