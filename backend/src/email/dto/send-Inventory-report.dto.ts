import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class SendInventoryReportDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsInt()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  emails: string;
}
