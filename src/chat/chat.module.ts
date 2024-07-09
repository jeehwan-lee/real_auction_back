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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendaceEntity,
      NoticeEntity,
      ChatEntity,
      AuctionEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    AttendanceService,
    NoticeService,
    ChatService,
    AuctionService,
  ],
})
export class ChatModule {}
