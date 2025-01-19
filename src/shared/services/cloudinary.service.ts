import { Readable } from 'node:stream';

import { BadRequestException, Injectable } from '@nestjs/common';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { ApiConfigService } from './api-config.service.ts';

@Injectable()
export class CloudinaryService {
  constructor(apiConfig: ApiConfigService) {
    cloudinary.v2.config({
      cloud_name: apiConfig.cloudinaryConfig.cloud_name,
      api_key: apiConfig.cloudinaryConfig.api_key,
      api_secret: apiConfig.cloudinaryConfig.api_secret,
    });
  }

  // Convert buffer to readable stream
  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable({
      read() {
        this.push(buffer);
        this.push(null); // Signals the end of the stream
      },
    });

    return stream;
  }

  async uploadPhoto(buffer: Buffer) {
    try {
      const url = await new Promise<UploadApiResponse | undefined>(
        (resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: 'Ubay' },
            (error, result) => {
              if (error) {
                reject(
                  new BadRequestException(`Upload failed: ${error.message}`),
                );
              } else {
                resolve(result);
              }
            },
          );

          const stream = this.bufferToStream(buffer);
          stream.pipe(uploadStream);
        },
      );

      return url;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async uploadSinglePhoto(buffer: Buffer) {
    const result = await this.uploadPhoto(buffer);

    return result ? result.url : null;
  }

  async uploadMultiplePhotos(buffers: Buffer[]) {
    const results = await Promise.all(buffers.map((e) => this.uploadPhoto(e)));

    return results.map((res) => res?.url);
  }

  async removePhoto(publicId: string) {
    await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }

  async removeMultiplePhotos(publicIds: string[]) {
    await Promise.all(
      publicIds.map(async (p) => {
        await this.removePhoto(p);
      }),
    );
  }
}
