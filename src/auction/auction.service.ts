import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { Like, Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Injectable } from '@nestjs/common';
import { NoticeService } from 'src/notice/notice.service';
import { CreateNoticeDto } from 'src/notice/dto/create-notice.dto';
import { AttendaceEntity } from 'src/attendance/entities/attendance.entity';
import { CreateAttendanceDto } from 'src/attendance/dto/create-attendance.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionEntity)
    private auctionRepository: Repository<AuctionEntity>,

    @InjectRepository(AttendaceEntity)
    private attendanceRepository: Repository<AttendaceEntity>,

    private noticeService: NoticeService,
  ) {}

  async createAuction(createAuctionDto: CreateAuctionDto) {
    const createdAuction = await this.auctionRepository.save(createAuctionDto);

    const attendance = new CreateAttendanceDto();
    attendance.auctionId = Number(createdAuction.id);
    attendance.userId = createAuctionDto.userId;
    attendance.auctionName = createAuctionDto.name;

    await this.attendanceRepository.save(attendance);

    const notice = new CreateNoticeDto();
    notice.name = '경매개설';
    notice.description = createAuctionDto.name;
    notice.userId = createAuctionDto.userId;
    notice.auctionId = Number(createdAuction.id);

    await this.noticeService.createNotice(notice);

    return createdAuction;
  }

  async getAuctionList() {
    const auctionList = await this.auctionRepository.find({
      relations: ['user', 'attendances'],
    });

    return auctionList;
  }

  async getAllAuctionListBySearchParam(searchParam: string) {
    const auctionList = await this.auctionRepository.find({
      where: {
        name: Like(`%${searchParam}%`),
      },
      relations: ['user', 'attendances'],
    });

    return auctionList;
  }

  async getAuctionListByUserId(userId: number) {
    const auctionList = await this.auctionRepository.find({
      where: {
        userId: userId,
      },
      relations: ['attendances'],
    });

    return auctionList;
  }
}
