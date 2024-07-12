import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AttendanceService } from 'src/attendance/attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendaceEntity } from 'src/attendance/entities/attendance.entity';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { NoticeService } from 'src/notice/notice.service';
import { ChatEntity } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { AuctionService } from 'src/auction/auction.service';
import { AuctionEntity } from 'src/auction/entities/auction.entity';
import { ChatController } from './chat.controller';
import { BidEntity } from 'src/bid/entities/bid.entity';
import { BidService } from 'src/bid/bid.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendaceEntity,
      NoticeEntity,
      ChatEntity,
      AuctionEntity,
      BidEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    AttendanceService,
    NoticeService,
    ChatService,
    AuctionService,
    BidService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
