import {
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { Auth } from '../../common/decorators/http.decorators.ts';
import { SharpPipe } from '../../common/pipes/sharp.pipe.ts';
import { PhotosService } from './photos.service.ts';

@ApiTags('Photos')
@Controller({ path: 'photos', version: '1' })
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  //Upload single image
  @Auth({ jwtAccessToken: true })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload single photo',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['photo'],
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post('single')
  async uploadSingle(
    @UploadedFile(SharpPipe)
    photo: string,
    @Req() req: Request,
  ) {
    return this.photosService.uploadSingle(photo, req);
  }

  //Upload multiple photos
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple photos',
    description: 'Upload up to 3 photos at a time.',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['photos'],
      properties: {
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            title: 'photo',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos' }]))
  @Post('multiple')
  uploadMultiple(
    @UploadedFiles(ParseFilePipe, SharpPipe)
    photos: string[],
    @Req() req: Request,
  ) {
    return this.photosService.uploadMultiple(photos, req);
  }
}
