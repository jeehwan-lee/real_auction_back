import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { In, LessThan, Like, Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Injectable } from '@nestjs/common';
import { NoticeService } from 'src/notice/notice.service';
import { CreateNoticeDto } from 'src/notice/dto/create-notice.dto';
import { AttendaceEntity } from 'src/attendance/entities/attendance.entity';
import { CreateAttendanceDto } from 'src/attendance/dto/create-attendance.dto';
import { Cron } from '@nestjs/schedule';

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

  async getAuctionList(search: string, page: number) {
    const auctionList = await this.auctionRepository.find({
      where: {
        name: Like(`%${search}%`),
      },
      relations: ['user', 'attendances'],
      order: { createdDt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });

    return auctionList;
  }

  async getAuctionListByUserId(userId: number, page: number) {
    // userId를 통해 Attendance Table에서 참석하고 있는 auctionId를 가져옴
    const attendanceList = await this.attendanceRepository.find({
      where: {
        userId: userId,
      },
    });

    const auctionIdList = [];

    attendanceList.map((attendance) => {
      auctionIdList.push(attendance.auctionId);
    });

    // auctionId를 통해 Auction Table에서 Auction 정보를 가져와서 return
    return await this.auctionRepository.find({
      where: {
        id: In(auctionIdList),
      },
      relations: ['attendances'],
      order: { createdDt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  async getAuctionByAuctionId(auctionId: number) {
    // userId를 통해 Attendance Table에서 참석하고 있는 auctionId를 가져옴
    const auction = await this.auctionRepository.findOne({
      where: {
        id: auctionId.toString(),
      },
      relations: ['attendances', 'bids'],
    });

    const maxBid = auction.bids.sort(
      (a, b) => Number(b.bidPrice) - Number(a.bidPrice),
    )[0];

    return { ...auction, maxBid: maxBid };
  }

  @Cron('*/10 * * * * *')
  async handleCloseAuction() {
    // 현재 시간과 비교하여 마감시간이 지난 Auction 확인
    const currentDate = new Date();
    const closedAuctionList = await this.auctionRepository.find({
      where: {
        endDate: LessThan(currentDate),
        close: 'N',
      },
      relations: ['attendances', 'bids'],
    });

    closedAuctionList.map(async (auction) => {
      // 마감시간이 지난 Auction은 마감처리
      await this.auctionRepository.update(auction.id, { close: 'Y' });

      const maxBidAuction = await this.getAuctionByAuctionId(
        Number(auction.id),
      );

      //경매금액이 입력되었으며, 그 중 가장 높은 금액으로 입력한 사람에게 공지 보냄
      if (maxBidAuction.maxBid) {
        const notice = new CreateNoticeDto();
        notice.name = '경매낙찰';
        notice.description = auction.name;
        notice.userId = Number(maxBidAuction.maxBid.userId);
        notice.auctionId = Number(auction.id);

        await this.noticeService.createNotice(notice);
      }
    });
  }
}
