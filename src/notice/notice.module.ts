import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity])],
  providers: [NoticeService],
})
export class NoticeModule {}
