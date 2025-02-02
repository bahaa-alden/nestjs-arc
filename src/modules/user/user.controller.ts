import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type.ts';
import { AuthUser } from '../../common/decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../common/decorators/http.decorators.ts';
import { PaginationQuery } from '../../common/decorators/pagination.decorator.ts';
import { PageDto } from '../../common/dto/page.dto.ts';
import { UseLanguageInterceptor } from '../../common/interceptors/language-interceptor.service.ts';
import { ResponsePaging } from '../../shared/response/decorators/response.decorator.ts';
import { TranslationService } from '../../shared/services/translation.service.ts';
import { UserDto } from './dtos/user.dto.ts';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('admin')
  @Auth({ roles: [RoleType.USER], jwtAccessToken: true })
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  // @Auth({ roles: [RoleType.USER], jwtAccessToken: true })
  @ResponsePaging({
    description: 'Get users list',
    type: UserDto,
  })
  @Auth({ roles: [RoleType.USER], jwtAccessToken: true })
  getUsers(
    @PaginationQuery({ availableSearch: ['name', 'email'] })
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth({ roles: [RoleType.USER], jwtAccessToken: true })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: string): Promise<UserDto> {
    return this.userService.getUser(userId as Uuid);
  }
}
