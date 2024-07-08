import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AttendanceService } from 'src/attendance/attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendaceEntity } from 'src/attendance/entities/attendance.entity';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { NoticeService } from 'src/notice/notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendaceEntity, NoticeEntity])],
  providers: [ChatGateway, AttendanceService, NoticeService],
})
export class ChatModule {}
