import { IsNotEmpty } from 'class-validator';

export class FriendAddDto {
  @IsNotEmpty({
    message: '添加好友的 name 不能为空',
  })
  name: string;

  reason: string;
}
