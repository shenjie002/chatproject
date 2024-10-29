import { FriendshipService } from './friendship.service';
import { FriendAddDto } from './dto/friend-add.dto';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    add(friendAddDto: FriendAddDto, userId: number): Promise<{
        code: number;
        ok: string;
        data: {
            id: number;
            createTime: Date;
            updateTime: Date;
            status: number;
            fromUserId: number;
            toUserId: number;
            reason: string;
        };
    }>;
    list(userId: number): Promise<{
        toMe: any[];
        fromMe: any[];
    }>;
    agree(friendId_: string, userId_: string): Promise<{
        code: number;
        ok: string;
    }>;
    reject(friendId_: string, userId_: string): Promise<{
        code: number;
        ok: string;
    }>;
    friendship(userId_: string, name: string): Promise<any[]>;
    remove(friendId_: string, userId: number): Promise<string>;
}
