import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
} from '../../../decorators/field.decorators.ts';
import { IsUnique } from '../../../validators/unique.validator.ts';
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
}
