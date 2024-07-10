import { IsNumber, IsString } from 'class-validator';

export class DeleteAttendanceDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  userId: number;

  @IsString()
  auctionName: string;
}
