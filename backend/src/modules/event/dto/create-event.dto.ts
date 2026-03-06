import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsInt()
  locationId: number;
}
