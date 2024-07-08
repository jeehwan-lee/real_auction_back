import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendaceEntity } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendaceEntity)
    private attendanceRepository: Repository<AttendaceEntity>,
  ) {}

  async createAttendance(createAttendanceDto: CreateAttendanceDto) {
    return await this.attendanceRepository.save(createAttendanceDto);
  }
}
