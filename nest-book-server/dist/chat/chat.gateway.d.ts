import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
interface JoinRoomPayload {
    chatroomId: number;
    userId: number;
}
interface SendMessagePayload {
    sendUserId: number;
    chatroomId: number;
    message: {
        type: 'text' | 'image';
        content: string;
    };
}
export declare class ChatGateway {
    private readonly chatService;
    private chatHistoryService;
    constructor(chatService: ChatService);
    server: Server;
    joinRoom(client: Socket, payload: JoinRoomPayload): void;
    sendMessage(payload: SendMessagePayload): Promise<void>;
}
export {};
