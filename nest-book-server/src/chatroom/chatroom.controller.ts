import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { LoginGuard } from 'src/login.guard';

@Controller('chatroom')
@UseGuards(LoginGuard) //增加的身份验证token
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('create-one-to-one')
  async oneToOne(
    @Query('friendId') friendId_: string,
    @UserInfo('id') userId: string,
  ) {
    const friendId = parseInt(friendId_);
    if (!friendId) {
      throw new BadRequestException('聊天好友的 id 不能为空');
    }
    return this.chatroomService.createOneToOneChatroom(friendId, userId);
  }

  @Get('create-group')
  async group(@Query('name') name: string, @UserInfo('id') userId: number) {
    return this.chatroomService.createGroupChatroom(name, userId);
  }
  @Get('list')
  async list(@UserInfo('id') userId: number, @Query('name') name: string) {
    if (!userId) {
      throw new HttpException(
        {
          status: 402,
          message: {
            emailCode: 'userId 不能为空',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const list = await this.chatroomService.list(userId, name);
    return {
      code: 200,
      ok: 'success',
      list: list,
    };
  }
  //查询聊天室的所有用户
  @Get('members')
  async members(@Query('chatroomId') chatroomId_: string) {
    const chatroomId = parseInt(chatroomId_);
    if (!chatroomId) {
      throw new BadRequestException('chatroomId 不能为空');
    }
    return this.chatroomService.members(chatroomId);
  }
  //查询单个chartroom所有信息
  @Get('info/:id')
  async info(@Param('id') id_: string) {
    const id = parseInt(id_);
    if (!id) {
      throw new BadRequestException('id 不能为空');
    }
    return this.chatroomService.info(id);
  }
  //加入群聊
  @Get('join/:id')
  async join(
    @Param('id') id_: string,
    @Query('joinUsername') joinUsername: string,
  ) {
    const id = parseInt(id_);

    if (!id) {
      throw new HttpException(
        {
          status: 402,
          message: {
            id: 'id 不能为空',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!joinUsername) {
      throw new HttpException(
        {
          status: 402,
          message: {
            joinUsername: 'joinUsername 不能为空',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.chatroomService.join(id, joinUsername);
  }
  //退出出群聊
  @Get('quit/:id')
  async quit(
    @Param('id') id_: string,
    @Query('quitUserId') quitUserId_: string,
  ) {
    const id = parseInt(id_);
    const quitUserId = parseInt(quitUserId_);

    if (!id) {
      throw new BadRequestException('id 不能为空');
    }
    if (!quitUserId) {
      throw new BadRequestException('quitUserId 不能为空');
    }
    return this.chatroomService.quit(id, quitUserId);
  }
}
