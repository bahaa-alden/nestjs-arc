import {
  PasswordField,
  StringField,
} from '../../../common/decorators/field.decorators.ts';

export class AuthResetPasswordDto {
  @PasswordField()
  password!: string;

  @StringField()
  hash!: string;
}
