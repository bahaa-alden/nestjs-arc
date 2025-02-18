/* eslint-disable sonarjs/pseudo-random */

import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import type { IFile } from '../../../common/interfaces/IFile';
import { IHelperPhotoService } from '../interfaces/helper-photo-service.interface.ts';

@Injectable()
export class HelperPhotoService implements IHelperPhotoService {
  async customize(image: IFile) {
    const folderPath = path.join(
      import.meta.dirname,
      '..',
      '..',
      '..',
      '..',
      'public',
      'photos',
    );

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, {
        recursive: true,
      });
    }

    const randomName = Array.from({ length: 32 })
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const filename = `${randomName}${path.extname(image.originalname)}`;
    await sharp(image.buffer)
      .resize({ width: 1100, height: 700 })
      .ensureAlpha()
      .raw()
      .toFormat('jpg')
      .jpeg({
        quality: 80,
        chromaSubsampling: '4:4:4',
        progressive: true,
        optimizeCoding: true,
        trellisQuantisation: true,
        overshootDeringing: true,
        optimizeScans: true,
        mozjpeg: true,
        quantisationTable: 0,
      })
      .toFile(path.join(folderPath, filename));

    return filename;
  }

  getPhotoPath(p: string) {
    if (!p) {
      return;
    }

    const dir = p.slice(Math.max(0, p.indexOf('/photos')));
    const paths = `public${dir}`;

    return paths;
  }
}
