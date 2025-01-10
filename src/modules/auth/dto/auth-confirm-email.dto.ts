import { StringField } from '../../../decorators/field.decorators.ts';

export class AuthConfirmEmailDto {
  @StringField()
  hash!: string;
}
