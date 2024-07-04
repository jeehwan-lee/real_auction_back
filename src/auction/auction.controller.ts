import { Body, Controller, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Post('create')
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return await this.auctionService.createAuction(createAuctionDto);
  }
}
