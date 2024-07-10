import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendaceEntity } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { NoticeService } from 'src/notice/notice.service';
import { CreateNoticeDto } from 'src/notice/dto/create-notice.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { DeleteAttendanceDto } from './dto/delete-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendaceEntity)
    private attendanceRepository: Repository<AttendaceEntity>,

    private noticeService: NoticeService,
  ) {}

  async createAttendance(createAttendanceDto: CreateAttendanceDto) {
    const createdAttendance =
      await this.attendanceRepository.save(createAttendanceDto);

    const notice = new CreateNoticeDto();

    notice.name = '경매참석';
    notice.description = createAttendanceDto.auctionName;
    notice.userId = createAttendanceDto.userId;
    notice.auctionId = createAttendanceDto.auctionId;

    await this.noticeService.createNotice(notice);

    return createdAttendance;
  }

  async deleteAttendance(deleteAttendanceDto: DeleteAttendanceDto) {
    const createdAttendance = await this.attendanceRepository.delete({
      userId: deleteAttendanceDto.userId,
      auctionId: deleteAttendanceDto.auctionId,
    });

    const notice = new CreateNoticeDto();

    notice.name = '경매퇴장';
    notice.description = deleteAttendanceDto.auctionName;
    notice.userId = deleteAttendanceDto.userId;
    notice.auctionId = deleteAttendanceDto.auctionId;

    await this.noticeService.createNotice(notice);

    return createdAttendance;
  }

  async checkUserInAuctionRoom(userId: number, auctionId: number) {
    return await this.attendanceRepository.find({
      where: {
        userId: userId,
        auctionId: auctionId,
      },
    });
  }
}
