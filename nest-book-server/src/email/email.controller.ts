import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private redisServide: RedisService,
  ) {}

  @Get('code')
  async sendEmailCode(@Query('address') address) {
    console.log('前端传来的address', address);
    const code = Math.random().toString().slice(2, 8);
    await this.redisServide.set(`emailCode_${address}`, code, 10 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }
}
