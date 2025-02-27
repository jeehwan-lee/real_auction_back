import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeController } from './notice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity])],
  providers: [NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}
