import { IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  userId: number;

  @IsString()
  bidPrice: string;

  @IsNumber()
  auctionId: number;

  @IsString()
  auctionName: string;
}
