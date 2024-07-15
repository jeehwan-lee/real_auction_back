import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  async getAllAuctionList(
    @Query('search') search: string,
    @Query('page') page: number,
  ) {
    return await this.auctionService.getAuctionList(search, page);
  }

  @Get('/list/myAuction/:id')
  async getAuctionListByUserId(
    @Param('id') userId: number,
    @Query('page') page: number,
  ) {
    return await this.auctionService.getAuctionListByUserId(userId, page);
  }

  @Get('/:id')
  async getAuctionByAuctionId(@Param('id') auctionId: number) {
    return await this.auctionService.getAuctionByAuctionId(auctionId);
  }
}
