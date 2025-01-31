import { StringField } from '../../../common/decorators/field.decorators.ts';

export class AuthConfirmEmailDto {
  @StringField()
  hash!: string;
}
