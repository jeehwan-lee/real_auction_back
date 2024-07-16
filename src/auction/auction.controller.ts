import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Observable, interval, map } from 'rxjs';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @UseGuards(AuthGuard)
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

  @Sse('/sse/time')
  sse(@Param('id') auctionId: number): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: { time: new Date().toISOString() } }) as MessageEvent),
    );
  }
}
