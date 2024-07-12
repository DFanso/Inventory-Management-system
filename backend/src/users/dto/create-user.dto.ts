import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from 'src/Types/users.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the user' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsEnum(UserRole)
  @ApiProperty({ description: 'The role of the user', enum: UserRole })
  role: UserRole;
}
