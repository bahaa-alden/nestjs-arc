import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterService } from '../../shared/services/multer.service.ts';
import { PhotosController } from './photos.controller.ts';
import { PhotosService } from './photos.service.ts';

@Module({
  imports: [MulterModule.registerAsync({ useClass: MulterService })],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
