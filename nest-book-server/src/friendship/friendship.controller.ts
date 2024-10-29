import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendAddDto } from './dto/friend-add.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { LoginGuard } from 'src/login.guard';
// import { RequireLogin, UserInfo } from 'src/custom.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('add')
  //   @RequireLogin()
  @UseGuards(LoginGuard) //增加的身份验证token
  async add(
    @Body() friendAddDto: FriendAddDto,
    @UserInfo('id') userId: number,
  ) {
    const data = await this.friendshipService.add(friendAddDto, userId);
    return {
      code: 200,
      ok: '添加成功',
      data: data,
    };
  }
  @Get('request_list')
  @UseGuards(LoginGuard) //增加的身份验证token
  async list(@UserInfo('id') userId: number) {
    return this.friendshipService.list(userId);
  }

  @Get('agree/:id')
  @UseGuards(LoginGuard) //增加的身份验证token
  async agree(@Param('id') friendId_: string, @UserInfo('id') userId_: string) {
    const userId = parseInt(userId_);
    const friendId = parseInt(friendId_);
    if (!friendId) {
      throw new BadRequestException('添加的好友 id 不能为空');
    }
    return this.friendshipService.agree(friendId, userId);
  }

  @Get('reject/:id')
  @UseGuards(LoginGuard) //增加的身份验证token
  async reject(
    @Param('id') friendId_: string,
    @UserInfo('id') userId_: string,
  ) {
    const userId = parseInt(userId_);
    const friendId = parseInt(friendId_);
    if (!friendId) {
      throw new BadRequestException('添加的好友 id 不能为空');
    }
    return this.friendshipService.reject(friendId, userId);
  }
  //好友列表
  @Get('list')
  @UseGuards(LoginGuard) //增加的身份验证token
  async friendship(
    @UserInfo('id') userId_: string,
    @Query('name') name: string,
  ) {
    const userId = parseInt(userId_);
    return this.friendshipService.getFriendship(userId, name);
  }
  @Get('remove/:id')
  @UseGuards(LoginGuard) //增加的身份验证token
  async remove(@Param('id') friendId_: string, @UserInfo('id') userId: number) {
    const friendId = parseInt(friendId_);
    return this.friendshipService.remove(friendId, userId);
  }
}
