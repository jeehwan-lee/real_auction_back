import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private noticeRepository: Repository<NoticeEntity>,
  ) {}

  async createNotice(createNoticeDto: CreateNoticeDto) {
    return await this.noticeRepository.save(createNoticeDto);
  }

  async getNoticeListByUserId(userId: number, page: number) {
    const noticeList = await this.noticeRepository.find({
      where: {
        userId: userId,
      },
      relations: ['user', 'auction'],
      order: { createdDt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });

    return noticeList;
  }
}
