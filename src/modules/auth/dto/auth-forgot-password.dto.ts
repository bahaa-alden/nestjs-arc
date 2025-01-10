import { EmailField } from '../../../decorators/field.decorators.ts';

export class AuthForgotPasswordDto {
  @EmailField()
  email!: string;
}
