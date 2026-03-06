import { IsString, IsInt } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  maxCapacity: number;
}
