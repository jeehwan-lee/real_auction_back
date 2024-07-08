import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendaceEntity } from './entities/attendance.entity';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttendaceEntity])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
