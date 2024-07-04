import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateAuctionDto {
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  description: string;

  @IsNumber()
  startPrice: number;

  @IsDateString()
  endDate: Date = new Date();

  @IsString()
  photoUrl: string;

  @IsString()
  userId: string;
}
