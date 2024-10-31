export declare class ChatroomService {
    private prismaService;
    createOneToOneChatroom(friendId: number, userId_: string): Promise<{
        code: number;
        ok: string;
    }>;
    createGroupChatroom(name: string, userId: number): Promise<{
        code: number;
        ok: string;
    }>;
    list(userId: number, name: string): Promise<any[]>;
    members(chatroomId: number): Promise<{
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
    info(id: number): Promise<{
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
    join(id: number, joinUsername: string): Promise<{
        code: number;
        ok: string;
        chatroomId: number;
    }>;
    quit(id: number, userId: number): Promise<string>;
}
