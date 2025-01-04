import { S3 } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Injectable } from '@nestjs/common';
import mime from 'mime-types';

import type { IFile } from './../../interfaces/IFile.ts';
import { ApiConfigService } from './api-config.service.ts';
import { GeneratorService } from './generator.service.ts';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor(
    public configService: ApiConfigService,
    public generatorService: GeneratorService,
  ) {
    const config = configService.awsS3Config;
    this.s3 = new S3({
      apiVersion: config.bucketApiVersion,
      region: config.bucketRegion,
      credentials: {
        accessKeyId: config.accessId,
        secretAccessKey: config.secretId,
      },
    });
  }

  async uploadImage(file: IFile): Promise<string> {
    const fileName = this.generatorService.fileName(
      mime.extension(file.mimetype) as string,
    );

    const key = `images/${fileName}`;
    await this.s3.putObject({
      Bucket: this.configService.awsS3Config.bucketName,
      Body: file.buffer,
      // ACL: 'public-read',
      Key: key,
    });

    return key;
  }

  async getSignedUrl(key: string, expiration = 3600) {
    const signedUrl = await createPresignedPost(this.s3, {
      Bucket: this.configService.awsS3Config.bucketName,
      Key: key,
      Expires: expiration,
      Conditions: [['content-length-range', 0, 10_000_000]],
      Fields: {
        key,
      },
    });

    return signedUrl;
  }
}
