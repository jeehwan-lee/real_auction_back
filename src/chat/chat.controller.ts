import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/list')
  async getChatList(
    @Query('id') auctionId: number,
    @Query('page') page: number,
  ) {
    return await this.chatService.getChatList(auctionId, page);
  }
}
