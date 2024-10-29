import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/redister-user.dto';
import type { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from 'src/login.guard';
import { UserInfo } from 'src/custom.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register') //注册
  async register(@Body() registerUser: RegisterUserDto) {
    // console.log('registerUser.emailCode', registerUser.emailCode);
    // console.log(`emailCode_${registerUser.email}`);
    // const captcha = await this.redisService.get(
    //   `emailCode_${registerUser.email}`,
    // );
    // console.log('captcha', captcha);
    // if (!captcha) {
    //   throw new HttpException(
    //     {
    //       status: 402,
    //       message: {
    //         emailCode: '验证码已失效',
    //       },
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // if (registerUser.emailCode !== captcha) {
    //   throw new HttpException(
    //     {
    //       status: 402,
    //       message: {
    //         emailCode: '验证码不正确',
    //       },
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    return this.userService.register(registerUser);
  }

  @Post('Login') //登录
  async Login(
    @Body() LoginUser: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('接收前端传来的值', LoginUser);
    const foundUser = await this.userService.login(LoginUser);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          name: foundUser.name,
        },
      });
      res.setHeader('token', token);
      return {
        code: 200,
        ok: 'success',
        token: token,
        user: foundUser,
      };
    }
  }
}
