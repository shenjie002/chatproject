import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService, PrismaService],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
