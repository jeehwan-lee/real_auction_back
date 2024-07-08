import { IsNumber, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  userId: number;

  @IsString()
  auctionName: string;
}
