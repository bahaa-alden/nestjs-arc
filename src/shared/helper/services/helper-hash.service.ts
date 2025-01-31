import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import cryptoJs from 'crypto-js';

import { IHelperHashService } from '../interfaces/helper-hash-service.interface.ts';

@Injectable()
export class HelperHashService implements IHelperHashService {
  randomSalt(length: number): string {
    return genSaltSync(length);
  }

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  }

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  }

  sha256(string: string): string {
    return cryptoJs.SHA256(string).toString(cryptoJs.enc.Hex);
  }

  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  }
}
