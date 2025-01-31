import { BooleanFieldOptional } from '../../../common/decorators/field.decorators.ts';

export class CreateSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified?: boolean;

  @BooleanFieldOptional()
  isPhoneVerified?: boolean;
}
