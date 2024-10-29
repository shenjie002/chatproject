import { FriendAddDto } from './dto/friend-add.dto';
export declare class FriendshipService {
    private prismaService;
    add(friendAddDto: FriendAddDto, userId: number): Promise<{
        id: number;
        createTime: Date;
        updateTime: Date;
        status: number;
        fromUserId: number;
        toUserId: number;
        reason: string;
    }>;
    list(userId: number): Promise<{
        toMe: any[];
        fromMe: any[];
    }>;
    agree(friendId: number, userId: number): Promise<{
        code: number;
        ok: string;
    }>;
    reject(friendId: number, userId: number): Promise<{
        code: number;
        ok: string;
    }>;
    getFriendship(userId: number, name: string): Promise<any[]>;
    remove(friendId: number, userId: number): Promise<string>;
}
