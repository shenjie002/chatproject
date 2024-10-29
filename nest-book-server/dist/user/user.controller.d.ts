import { UserService } from './user.service';
import { RegisterUserDto } from './dto/redister-user.dto';
import type { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    redisService: RedisService;
    private jwtService;
    register(registerUser: RegisterUserDto): Promise<{
        code: number;
        ok: string;
    }>;
    Login(LoginUser: LoginUserDto, res: Response): Promise<{
        code: number;
        ok: string;
        token: string;
        user: {
            name: string;
            nick_name: string;
            email: string;
            password: string;
            id: number;
            headPic: string;
            createTime: Date;
            updateTime: Date;
        };
    }>;
}
