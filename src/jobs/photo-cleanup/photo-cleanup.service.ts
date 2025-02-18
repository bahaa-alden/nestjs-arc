import { readdir, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoCleanupService {
  deletePhotosOlderThanDays(): void {
    const now = new Date();
    now.setDate(now.getDate() - 1);

    // Iterate through files in the directory
    const dir = path.join(
      import.meta.dirname,
      '..',
      '..',
      '..',
      'public',
      'photos',
    );
    readdir(dir, (err, files) => {
      if (err) {
        throw err;
      }

      for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStats = statSync(filePath);

        // Check if the file's modification date is older than 'days'
        if (fileStats.mtime < now) {
          unlinkSync(filePath); // Delete the file
        }
      }
    });
  }
}
