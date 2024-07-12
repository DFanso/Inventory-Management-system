import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the item' })
  name: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'The quantity of the item' })
  quantity: number;
}
