import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../../common/constants/role-type.ts';
import { Auth } from '../../../common/decorators/http.decorators.ts';
import { PaginationQuery } from '../../../common/decorators/pagination.decorator.ts';
import { ApiKeyNotExpiredPipe } from '../../../common/pipes/api-key-expired.pipe.ts';
import { ApiKeyIsActivePipe } from '../../../common/pipes/api-key-is-active.pipe.ts';
import { ApiKeyParsePipe } from '../../../common/pipes/api-key-parse.pipe.ts';
import { RequestRequiredPipe } from '../../../common/pipes/request-required.pipe.ts';
import { ResponsePaging } from '../../../shared/response/decorators/response.decorator.ts';
import { IResponse } from '../../../shared/response/interfaces/response.interface.ts';
import {
  ApiKeyAdminActiveDoc,
  ApiKeyAdminCreateDoc,
  ApiKeyAdminDeleteDoc,
  ApiKeyAdminInactiveDoc,
  ApiKeyAdminResetDoc,
  ApiKeyAdminUpdateDoc,
} from '../docs/api-key-admin.doc.ts';
import { ApiKeyDto } from '../dtos/api-key.dto.ts';
import { ApiKeysPageOptionsDto } from '../dtos/api-key-page.dto.ts';
import { ApiKeyCreateRawRequestDto } from '../dtos/request/api-key-create-request.dto.ts';
import { ApiKeyUpdateDateRequestDto } from '../dtos/request/api-key-update-date-request.dto.ts';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key-update-request.dto.ts';
import { ApiKeyEntity } from '../repository/entities/api-key.entity.ts';
import { ApiKeyService } from '../services/api-key.service.ts';

@ApiTags('apiKey')
@Controller('api-key')
export class ApiKeyAdminController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ResponsePaging({
    description: 'Get users list',
    type: ApiKeyDto,
  })
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Get('/list')
  async list(
    @PaginationQuery({ availableSearch: [] })
    pageOptionsDto: ApiKeysPageOptionsDto,
  ) {
    return this.apiKeyService.findAll(pageOptionsDto);
  }

  @ApiKeyAdminCreateDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Post('/create')
  async create(@Body() body: ApiKeyCreateRawRequestDto) {
    const created = await this.apiKeyService.create(body);

    return {
      data: created,
    };
  }

  @ApiKeyAdminResetDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Patch('/update/:apiKey/reset')
  async reset(
    @Param('apiKey', RequestRequiredPipe, ApiKeyParsePipe)
    apiKey: ApiKeyEntity,
  ): Promise<IResponse<Partial<ApiKeyDto>>> {
    const updated = await this.apiKeyService.reset(apiKey);

    return {
      data: updated,
    };
  }

  @ApiKeyAdminUpdateDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Put('/update/:apiKey')
  async update(
    @Body() body: ApiKeyUpdateRequestDto,
    @Param('apiKey', RequestRequiredPipe, ApiKeyParsePipe)
    apiKey: ApiKeyEntity,
  ) {
    await this.apiKeyService.update(apiKey, body);
  }

  @ApiKeyAdminInactiveDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Patch('/update/:apiKey/inactive')
  async inactive(
    @Param(
      'apiKey',
      RequestRequiredPipe,
      ApiKeyParsePipe,
      new ApiKeyIsActivePipe([true]),
      ApiKeyNotExpiredPipe,
    )
    apiKey: ApiKeyEntity,
  ): Promise<void> {
    await this.apiKeyService.inactive(apiKey);
  }

  @ApiKeyAdminActiveDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Patch('/update/:apiKey/active')
  async active(
    @Param(
      'apiKey',
      RequestRequiredPipe,
      ApiKeyParsePipe,
      new ApiKeyIsActivePipe([false]),
      ApiKeyNotExpiredPipe,
    )
    apiKey: ApiKeyEntity,
  ): Promise<void> {
    await this.apiKeyService.active(apiKey);
  }

  @ApiKeyAdminUpdateDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Put('/update/:apiKey/date')
  async updateDate(
    @Body() body: ApiKeyUpdateDateRequestDto,
    @Param('apiKey', RequestRequiredPipe, ApiKeyParsePipe)
    apiKey: ApiKeyEntity,
  ) {
    await this.apiKeyService.updateDate(apiKey, body);
  }

  @ApiKeyAdminDeleteDoc()
  @Auth({ roles: [RoleType.ADMIN], jwtAccessToken: true })
  @Delete('/delete/:apiKey')
  async delete(
    @Param('apiKey', RequestRequiredPipe, ApiKeyParsePipe)
    apiKey: ApiKeyEntity,
  ): Promise<void> {
    await this.apiKeyService.delete(apiKey);
  }
}
