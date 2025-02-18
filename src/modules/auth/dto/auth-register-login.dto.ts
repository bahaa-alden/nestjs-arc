import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  PhotoFieldOptional,
  StringField,
} from '../../../common/decorators/field.decorators.ts';
import { IsUnique } from '../../../shared/request/validations/request-unique.validation.ts';
import { UserEntity } from '../../user/user.entity.ts';

export class AuthRegisterLoginDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  @IsUnique(UserEntity)
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @PhoneFieldOptional()
  phone?: string;

  @PhotoFieldOptional()
  avatar?: string;
}
