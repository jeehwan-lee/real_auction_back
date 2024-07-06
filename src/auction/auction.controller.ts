import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Post('/create')
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return await this.auctionService.createAuction(createAuctionDto);
  }

  @Get('/list')
  async getAllAuctionList() {
    return await this.auctionService.getAuctionList();
  }

  @Get('/list/:id')
  async getAuctionListByUserId(@Param('id') userId: number) {
    return await this.auctionService.getAuctionListByUserId(userId);
  }
}
