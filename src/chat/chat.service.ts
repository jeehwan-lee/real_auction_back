import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { AttendanceService } from 'src/attendance/attendance.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,

    private attendanceService: AttendanceService,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return await this.chatRepository.save(createChatDto);
  }

  async getChatList(auctionId: number, userId: number) {
    const attendanceCheckResult =
      await this.attendanceService.checkUserInAuctionRoom(userId, auctionId);

    // 신규참여자일 경우 이전 Chat를 보내주지 않고 종료
    if (attendanceCheckResult.length == 0) return [];

    // 기존참여자의 경우 참여했던 날짜부터의 채팅만 보내줌
    const chatList = await this.chatRepository.find({
      where: {
        auctionId: auctionId,
        createdDt: MoreThan(attendanceCheckResult[0].createdDt),
      },
      order: { createdDt: 'DESC' },
      relations: ['user'],
    });
    return chatList.reverse();
  }
}
