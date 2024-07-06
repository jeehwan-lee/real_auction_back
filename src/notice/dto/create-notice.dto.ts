import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateNoticeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  description: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  auctionId: number;
}
