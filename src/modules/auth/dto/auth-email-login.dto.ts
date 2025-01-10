import {
  EmailField,
  PasswordField,
} from '../../../decorators/field.decorators.ts';

export class AuthEmailLoginDto {
  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
