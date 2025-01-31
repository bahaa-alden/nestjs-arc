import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyAdminController } from './controllers/api-key.controller.ts';
import { ApiKeyEntity } from './repository/entities/api-key.entity.ts';
import { ApiKeyRepository } from './repository/repositories/api-key.repository.ts';
import { ApiKeyService } from './services/api-key.service.ts';
import { ApiKeyXApiKeyStrategy } from './x-api-key/strategies/api-key-x-api-key.strategy.ts';

@Module({
  providers: [ApiKeyService, ApiKeyRepository],
  exports: [ApiKeyService, ApiKeyRepository],
  controllers: [ApiKeyAdminController],
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
})
export class ApiKeyModule {
  static forRoot(): DynamicModule {
    return {
      module: ApiKeyModule,
      providers: [ApiKeyService, ApiKeyXApiKeyStrategy, ApiKeyRepository],
      exports: [],
      controllers: [],
      imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
    };
  }
}
