import {
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators.ts';

export class AuthResetPasswordDto {
  @PasswordField()
  password!: string;

  @StringField()
  hash!: string;
}
