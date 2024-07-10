import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/list/:id')
  async getChatList(@Param('id') auctionId: number) {
    return await this.chatService.getChatList(auctionId);
  }
}
