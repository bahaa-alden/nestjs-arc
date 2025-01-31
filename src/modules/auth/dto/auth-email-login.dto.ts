import {
  EmailField,
  PasswordField,
} from '../../../common/decorators/field.decorators.ts';

export class AuthEmailLoginDto {
  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
