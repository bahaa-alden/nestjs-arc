import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type.ts';
import { AuthUser } from '../../common/decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../common/decorators/http.decorators.ts';
import { PaginationQuery } from '../../common/decorators/pagination.decorator.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { ResponsePaging } from '../../shared/response/decorators/response.decorator.ts';
import { UserEntity } from '../user/user.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';
import { PostDto } from './dtos/post.dto.ts';
import { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import { UpdatePostDto } from './dtos/update-post.dto.ts';
import { PostService } from './post.service.ts';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Auth({ roles: [RoleType.USER], jwtAccessToken: true })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PostDto })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: UserEntity,
  ) {
    const postEntity = await this.postService.createPost(
      user.id,
      createPostDto,
    );

    return postEntity.toDto();
  }

  @Get()
  @Auth({ roles: [RoleType.ADMIN, RoleType.USER], jwtAccessToken: true })
  @ResponsePaging({ type: PostDto })
  async getPosts(
    @PaginationQuery({ availableSearch: ['title', 'description'] })
    postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    return this.postService.getAllPost(postsPageOptionsDto);
  }

  @Get(':id')
  @Auth({ jwtAccessToken: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostDto })
  async getSinglePost(@UUIDParam('id') id: string): Promise<PostDto> {
    const entity = await this.postService.getSinglePost(id as Uuid);

    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @Auth({ jwtAccessToken: true })
  updatePost(
    @UUIDParam('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(id as Uuid, updatePostDto);
  }

  @Delete(':id')
  @Auth({ jwtAccessToken: true })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deletePost(@UUIDParam('id') id: string): Promise<void> {
    await this.postService.deletePost(id as Uuid);
  }
}
