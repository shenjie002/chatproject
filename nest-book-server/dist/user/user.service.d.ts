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
        name: string;
        nick_name: string;
        email: string;
        password: string;
        id: number;
        headPic: string;
        createTime: Date;
        updateTime: Date;
    }>;
}
