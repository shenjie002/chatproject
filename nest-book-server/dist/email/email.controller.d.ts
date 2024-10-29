import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';
export declare class EmailController {
    private readonly emailService;
    private redisServide;
    constructor(emailService: EmailService, redisServide: RedisService);
    sendEmailCode(address: any): Promise<string>;
}
