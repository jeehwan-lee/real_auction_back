import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/enter')
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return await this.attendanceService.createAttendance(createAttendanceDto);
  }
}
