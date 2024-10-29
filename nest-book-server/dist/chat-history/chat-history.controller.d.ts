import { ChatHistoryService } from './chat-history.service';
export declare class ChatHistoryController {
    private readonly chatHistoryService;
    constructor(chatHistoryService: ChatHistoryService);
    list(chatroomId: string): Promise<{
        code: number;
        ok: string;
        res: any[];
    }>;
}
