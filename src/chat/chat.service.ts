import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return await this.chatRepository.save(createChatDto);
  }

  async getChatList(auctionId: number) {
    const chatList = await this.chatRepository.find({
      where: { auctionId: auctionId },
      order: { createdDt: 'DESC' },
      take: 10,
      skip: 0,
    });
    return chatList.reverse();
  }
}
