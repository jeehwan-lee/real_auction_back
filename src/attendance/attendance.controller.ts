import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { DeleteAttendanceDto } from './dto/delete-attendance.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @UseGuards(AuthGuard)
  @Post('/enter')
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return await this.attendanceService.createAttendance(createAttendanceDto);
  }

  @UseGuards(AuthGuard)
  @Post('/exit')
  async deleteAttendance(@Body() deleteAttendanceDto: DeleteAttendanceDto) {
    return await this.attendanceService.deleteAttendance(deleteAttendanceDto);
  }
}
