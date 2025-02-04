/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IHelperJwtOptions,
  IHelperJwtVerifyOptions,
} from './helper.interface';

export interface IHelperEncryptionService {
  base64Encrypt(data: string): string;
  base64Decrypt(data: string): string;
  base64Compare(basicToken1: string, basicToken2: string): boolean;
  aes256Encrypt<T = Record<string, any>>(
    data: T,
    key: string,
    iv: string,
  ): string;
  aes256Decrypt<T = Record<string, any>>(
    encrypted: string,
    key: string,
    iv: string,
  ): T;
  aes256Compare(aes1: string, aes2: string): boolean;
  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string;
  jwtDecrypt<T>(token: string): T;
  jwtVerify<T>(token: string, options: IHelperJwtVerifyOptions): Promise<T>;
}
