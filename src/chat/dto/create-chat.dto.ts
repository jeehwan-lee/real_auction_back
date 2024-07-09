import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  messageType: string;

  @IsString()
  message: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  auctionId: number;
}
