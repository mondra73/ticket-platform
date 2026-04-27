import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './dto/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}