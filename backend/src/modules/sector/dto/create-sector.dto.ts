import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  totalStock: number;

  @IsInt()
  eventId: number;
}
