import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidEntity } from './entities/bid.entity';
import { Repository } from 'typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { NoticeService } from 'src/notice/notice.service';
import { CreateNoticeDto } from 'src/notice/dto/create-notice.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(BidEntity)
    private bidRepository: Repository<BidEntity>,

    private noticeService: NoticeService,
  ) {}

  async createBid(createBidDto: CreateBidDto) {
    const createdBid = await this.bidRepository.save(createBidDto);

    const notice = new CreateNoticeDto();

    notice.name = '입찰참여';
    notice.description = createBidDto.auctionName;
    notice.userId = createBidDto.userId;
    notice.auctionId = createBidDto.auctionId;

    await this.noticeService.createNotice(notice);

    return createdBid;
  }
}
