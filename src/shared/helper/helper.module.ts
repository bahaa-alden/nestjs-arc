import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import ms from 'ms';

import { HelperArrayService } from './services/helper-array.service.ts';
import { HelperDateService } from './services/helper-date.service.ts';
import { HelperEncryptionService } from './services/helper-encryption.service.ts';
import { HelperHashService } from './services/helper-hash.service.ts';
import { HelperNumberService } from './services/helper-number.service.ts';
import { HelperStringService } from './services/helper-string.service.ts';

@Global()
@Module({})
export class HelperModule {
  static forRoot(): DynamicModule {
    return {
      module: HelperModule,
      providers: [
        HelperArrayService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
        HelperStringService,
      ],
      exports: [
        HelperArrayService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
        HelperStringService,
      ],
      controllers: [],
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: '123456',
            signOptions: {
              expiresIn: ms('1h'),
            },
          }),
        }),
      ],
    };
  }
}
