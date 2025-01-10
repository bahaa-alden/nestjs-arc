import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dtos/user.dto.ts';

export class LoginResponseDto {
  @ApiProperty()
  token!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  tokenExpires!: number;

  @ApiProperty({
    type: () => UserDto,
  })
  user!: UserDto;
}
