import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nick_name: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '必须是一个有效的邮箱地址' })
  email: string;

  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  emailCode: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少 6 位' })
  password: string;
}
