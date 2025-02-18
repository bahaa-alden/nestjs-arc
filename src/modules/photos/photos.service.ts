import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PhotosService {
  async uploadSingle(photo: string, req: Request): Promise<string> {
    const { protocol } = req;
    const host = req.get('Host');
    const fullUrl = `${protocol}://${host}/`;

    return new Promise((resolve) => {
      resolve(`${fullUrl}photos/${photo}`);
    });
  }

  async uploadMultiple(photos: string[], req: Request) {
    const links = Promise.all(
      photos.map(async (e) => this.uploadSingle(e, req)),
    );

    return links;
  }
}
