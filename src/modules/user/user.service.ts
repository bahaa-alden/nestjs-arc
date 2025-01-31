import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { FileNotImageException } from '../../common/exceptions/file-not-image.exception.ts';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception.ts';
import type { IFile } from '../../common/interfaces/IFile.ts';
import { CloudinaryService } from '../../shared/services/cloudinary.service.ts';
import { ValidatorService } from '../../shared/services/validator.service.ts';
import type { Reference } from '../../types.ts';
import { AuthRegisterLoginDto } from '../auth/dto/auth-register-login.dto.ts';
import { CreateSettingsCommand } from './commands/create-settings.command.ts';
import { UpdateSettingsCommand } from './commands/update-settings.command.ts';
import { CreateSettingsDto } from './dtos/create-settings.dto.ts';
import type { UserDto } from './dtos/user.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import type { UserSettingsEntity } from './user-settings.entity.ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
    private cloudinaryService: CloudinaryService,
    private commandBus: CommandBus,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(
    userRegisterDto: AuthRegisterLoginDto,
    file?: Reference<IFile>,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.cloudinaryService.uploadSinglePhoto(file.buffer);
    }

    await this.userRepository.save(user);

    user.settings = await this.createSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (pageOptionsDto.q) {
      queryBuilder.searchByString(pageOptionsDto.q, ['email']);
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async update(
    id: Uuid,
    dto?: QueryDeepPartialEntity<UserEntity>,
  ): Promise<UserDto> {
    await this.userRepository.update({ id }, { ...dto });

    return this.getUser(id);
  }

  createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }

  updateSettings(
    userId: Uuid,
    updateSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<UpdateSettingsCommand, UserSettingsEntity>(
      new UpdateSettingsCommand(userId, updateSettingsDto),
    );
  }

  async softDelete(id: Uuid): Promise<void> {
    const user = await this.getUser(id);

    await this.userRepository.softRemove({ id: user.id });
  }
}
