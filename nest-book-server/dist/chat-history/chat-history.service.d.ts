import { ChatHistory } from '@prisma/client';
export type HistoryDto = Pick<ChatHistory, 'chatroomId' | 'senderId' | 'type' | 'content'>;
export declare class ChatHistoryService {
    private prismaService;
    list(chatroomId: number): Promise<{
        code: number;
        ok: string;
        res: any[];
    }>;
    add(chatroomId: number, history: HistoryDto): Promise<{
        type: number;
        id: number;
        createTime: Date;
        updateTime: Date;
        chatroomId: number;
        content: string;
        senderId: number;
    }>;
}
