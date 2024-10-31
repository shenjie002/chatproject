import type { RegisterUserDto } from './dto/redister-user.dto';
import type { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';
export declare class UserService {
    private prisma;
    redisService: RedisService;
    register(data: RegisterUserDto): Promise<{
        code: number;
        ok: string;
    }>;
    login(data: LoginUserDto): Promise<{
        id: number;
        name: string;
        password: string;
        nick_name: string;
        email: string;
        headPic: string;
        createTime: Date;
        updateTime: Date;
    }>;
    findUserDetailById(id: number): Promise<{
        id: number;
        name: string;
        password: string;
        nick_name: string;
        email: string;
        headPic: string;
        createTime: Date;
        updateTime: Date;
    }>;
}
