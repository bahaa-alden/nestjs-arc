import { NotFoundException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateSettingsDto } from '../dtos/create-settings.dto.ts';
import { UserSettingsEntity } from '../user-settings.entity.ts';

export class UpdateSettingsCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly updateSettingsDto: CreateSettingsDto,
  ) {}
}

@CommandHandler(UpdateSettingsCommand)
export class UpdateSettingsHandler
  implements ICommandHandler<UpdateSettingsCommand, UserSettingsEntity>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepository: Repository<UserSettingsEntity>,
  ) {}

  async execute(command: UpdateSettingsCommand) {
    const { userId, updateSettingsDto } = command;
    const userSettingsEntity = await this.userSettingsRepository.findOneBy({
      userId,
    });

    if (!userSettingsEntity) {
      throw new NotFoundException(`User settings not found for user ${userId}`);
    }

    userSettingsEntity.isEmailVerified = updateSettingsDto.isEmailVerified;
    userSettingsEntity.isPhoneVerified = updateSettingsDto.isPhoneVerified;

    return this.userSettingsRepository.save(userSettingsEntity);
  }
}
