import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './dto/chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() dto: ChatDto) {
    const response = await this.chatService.chat(dto.message);
    return { response };
  }
}