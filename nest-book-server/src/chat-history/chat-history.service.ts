import { Inject, Injectable } from '@nestjs/common';
import { ChatHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

export type HistoryDto = Pick<
  ChatHistory,
  'chatroomId' | 'senderId' | 'type' | 'content'
>;

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
    });
    const res = [];

    for (let i = 0; i < history.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: history[i].senderId,
        },
        select: {
          id: true,
          name: true,
          nick_name: true,
          email: true,
          createTime: true,
          headPic: true,
        },
      });
      res.push({
        ...history[i],
        sender: user,
      });
    }
    return {
      code: 200,
      ok: '查询成功！',
      res,
    };
  }

  async add(chatroomId: number, history: HistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history,
    });
  }
}
