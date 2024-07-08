import { IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  userId: number;
}
