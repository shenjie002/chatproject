import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { Prisma } from '@prisma/client';
import type { RegisterUserDto } from './dto/redister-user.dto';
import type { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;
  @Inject(RedisService)
  redisService: RedisService;

  //注册
  async register(data: RegisterUserDto) {
    delete data.emailCode;
    const hasUser = await this.prisma.user.findUnique({
      where: {
        name: data.name,
      },
    });
    console.log('hasUser', hasUser);
    if (hasUser) {
      throw new HttpException(
        {
          status: 402,
          message: {
            name: '用户已存在',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const createData = await this.prisma.user.create({
      data,
    });
    return {
      code: 200,
      ok: 'success',
    };
  }

  //登录
  async login(data: LoginUserDto) {
    console.log('Controller传来的值', data);
    const hasUser = await this.prisma.user.findUnique({
      where: {
        name: data.name,
      },
    });
    console.log(hasUser);
    if (!hasUser) {
      //   throw new BadRequestException('该用户不存在');
      throw new HttpException(
        {
          status: 404,
          message: {
            name: '用户不存在',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (hasUser.password !== data.password) {
      //   throw new BadRequestException('密码不正确');
      throw new HttpException(
        {
          status: 401,
          message: {
            password: '密码不正确',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return hasUser;
  }
  //个人详细信息
  async findUserDetailById(id: number) {
    const data = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return data;
  }
}
