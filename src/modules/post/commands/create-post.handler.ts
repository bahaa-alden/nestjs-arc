import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTranslationDto } from '../../../common/dto/create-translation.dto.ts';
import { CreatePostDto } from '../dtos/create-post.dto.ts';
import { PostEntity } from '../post.entity.ts';
import { PostTranslationEntity } from '../post-translation.entity.ts';
import { CreatePostCommand } from './create-post.command.ts';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, PostEntity>
{
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(PostTranslationEntity)
    private postTranslationRepository: Repository<PostTranslationEntity>,
  ) {}

  async execute(command: CreatePostCommand) {
    const { userId, createPostDto } = command;
    const postEntity = this.postRepository.create({ userId });
    const translations = this.createTranslations(createPostDto, postEntity.id);

    await this.postRepository.save(postEntity);

    await this.postTranslationRepository.save(translations);

    postEntity.translations = translations;

    return postEntity;
  }

  private createTranslations(
    createPostDto: CreatePostDto,
    postId: string,
  ): PostTranslationEntity[] {
    return createPostDto.title.map(
      (createTranslationDto: CreateTranslationDto) => {
        const languageCode = createTranslationDto.languageCode;

        return this.postTranslationRepository.create({
          postId,
          languageCode,
          title: createTranslationDto.text,
          description: createPostDto.description.find(
            (desc) => desc.languageCode === languageCode,
          )!.text,
        });
      },
    );
  }
}
