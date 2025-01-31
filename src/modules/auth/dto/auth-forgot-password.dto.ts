import { EmailField } from '../../../common/decorators/field.decorators.ts';

export class AuthForgotPasswordDto {
  @EmailField()
  email!: string;
}
