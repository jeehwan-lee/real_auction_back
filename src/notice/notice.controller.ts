import { Controller, Get, Param } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @Get('/list/:id')
  async getNoticeListByUserId(@Param('id') userId: number) {
    return await this.noticeService.getNoticeListByUserId(userId);
  }
}
