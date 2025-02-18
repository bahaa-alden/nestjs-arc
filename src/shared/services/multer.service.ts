/* eslint-disable sonarjs/content-length */
import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Not an image! Please upload only images.'),
            false,
          );
        }
      },
      limits: { fileSize: 14_485_760 },
    };
  }
}
