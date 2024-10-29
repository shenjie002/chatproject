export declare class ChatroomService {
    private prismaService;
    createOneToOneChatroom(friendId: number, userId_: string): Promise<string>;
    createGroupChatroom(name: string, userId: number): Promise<string>;
    list(userId: number, name: string): Promise<any[]>;
    members(chatroomId: number): Promise<{
        name: string;
        nick_name: string;
        email: string;
        id: number;
        headPic: string;
        createTime: Date;
    }[]>;
    info(id: number): Promise<{
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
    join(id: number, userId: number): Promise<string>;
    quit(id: number, userId: number): Promise<string>;
}
