import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AuthService } from 'src/auth/auth.service';
import { NoticeService } from 'src/notice/notice.service';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { AttendaceEntity } from 'src/attendance/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionEntity, NoticeEntity, AttendaceEntity]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuthService, NoticeService],
})
export class AuctionModule {}
