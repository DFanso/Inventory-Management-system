import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: 'yourpassword',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
