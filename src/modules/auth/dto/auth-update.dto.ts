import {
  EmailFieldOptional,
  PasswordFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class AuthUpdateDto {
  @StringFieldOptional()
  readonly firstName?: string;

  @StringFieldOptional()
  readonly lastName?: string;

  @EmailFieldOptional()
  email?: string;

  @PasswordFieldOptional({ minLength: 6 })
  password?: string;

  @PhoneFieldOptional()
  phone?: string;

  @PasswordFieldOptional({ minLength: 6 })
  oldPassword?: string;
}
