import { ChatroomService } from './chatroom.service';
export declare class ChatroomController {
    private readonly chatroomService;
    constructor(chatroomService: ChatroomService);
    oneToOne(friendId_: string, userId: string): Promise<{
        code: number;
        ok: string;
    }>;
    group(name: string, userId: number): Promise<{
        code: number;
        ok: string;
    }>;
    list(userId: number, name: string): Promise<{
        code: number;
        ok: string;
        list: any[];
    }>;
    members(chatroomId_: string): Promise<{
        code: number;
        ok: string;
        users: {
            id: number;
            name: string;
            nick_name: string;
            email: string;
            headPic: string;
            createTime: Date;
        }[];
    }>;
    info(id_: string): Promise<{
        users: {
            code: number;
            ok: string;
            users: {
                id: number;
                name: string;
                nick_name: string;
                email: string;
                headPic: string;
                createTime: Date;
            }[];
        };
        id: number;
        name: string;
        createTime: Date;
        updateTime: Date;
        type: boolean;
    }>;
    join(id_: string, joinUsername: string): Promise<{
        code: number;
        ok: string;
        chatroomId: number;
    }>;
    quit(id_: string, quitUserId_: string): Promise<string>;
}
