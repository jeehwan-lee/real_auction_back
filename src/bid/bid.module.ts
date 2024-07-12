import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidEntity } from './entities/bid.entity';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { BidService } from './bid.service';
import { NoticeService } from 'src/notice/notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([BidEntity, NoticeEntity])],
  providers: [BidService, NoticeService],
})
export class BidModule {}
