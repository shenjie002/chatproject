import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface JwtUserData {
  userId: number;
  name: string;
}
export const RequireLogin = () => SetMetadata('require-login', true);
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    console.log('request登录装饰器', request.user);
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
