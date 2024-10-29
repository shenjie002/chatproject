import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';

@Module({
  imports: [ChatHistoryModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
