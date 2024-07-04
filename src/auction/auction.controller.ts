import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Post('create')
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return await this.auctionService.createAuction(createAuctionDto);
  }

  @Get('/list')
  async getAllAuctionList() {
    return await this.auctionService.getAuctionList();
  }

  @Get('/list/:id')
  async getAuctionListByUserId(@Param('id') userId: string) {
    return await this.auctionService.getAuctionListByUserId(userId);
  }
}
