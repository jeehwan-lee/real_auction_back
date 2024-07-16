import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendaceEntity } from './entities/attendance.entity';
import { AttendanceController } from './attendance.controller';
import { NoticeService } from 'src/notice/notice.service';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendaceEntity, NoticeEntity])],
  providers: [AttendanceService, NoticeService, AuthService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
