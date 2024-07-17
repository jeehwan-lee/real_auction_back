import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/list')
  async getChatList(
    @Query('id') auctionId: number,
    @Query('userId') userId: number,
  ) {
    return await this.chatService.getChatList(auctionId, userId);
  }
}
