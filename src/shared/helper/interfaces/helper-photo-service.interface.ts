import type { IFile } from '../../../common/interfaces/IFile';

export interface IHelperPhotoService {
  customize(image: IFile): Promise<string>;
  getPhotoPath(p: string): string | undefined;
}
