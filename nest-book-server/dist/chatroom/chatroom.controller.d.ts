import { ChatroomService } from './chatroom.service';
export declare class ChatroomController {
    private readonly chatroomService;
    constructor(chatroomService: ChatroomService);
    oneToOne(friendId_: string, userId: string): Promise<string>;
    group(name: string, userId: number): Promise<string>;
    list(userId: number, name: string): Promise<{
        code: number;
        ok: string;
        list: any[];
    }>;
    members(chatroomId_: string): Promise<{
        name: string;
        nick_name: string;
        email: string;
        id: number;
        headPic: string;
        createTime: Date;
    }[]>;
    info(id_: string): Promise<{
        users: {
            name: string;
            nick_name: string;
            email: string;
            id: number;
            headPic: string;
            createTime: Date;
        }[];
        name: string;
        type: boolean;
        id: number;
        createTime: Date;
        updateTime: Date;
    }>;
    join(id_: string, joinUserId_: string): Promise<string>;
    quit(id_: string, quitUserId_: string): Promise<string>;
}
