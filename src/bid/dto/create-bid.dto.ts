import { IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  userId: number;

  @IsString()
  auctionName: string;
}
