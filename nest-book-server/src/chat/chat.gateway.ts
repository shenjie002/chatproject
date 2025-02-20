import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image';
    content: string;
  };
}

// 添加 WebRTC 相关的接口
interface RTCPayload {
  type: 'offer' | 'answer' | 'candidate' | 'request' | 'accept' | 'reject';
  data: any;
  from: number;
  to: number;
  chatroomId: string;
  fromName?: string;
}

import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @Inject(UserService)
  private userService: UserService;

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;
  private videoRooms = new Map<string, Set<number>>();
  private userSocketMap = new Map<number, Socket>();
  private currentId = Date.now();
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    const roomName = payload.chatroomId.toString();
    // console.log('payload=>', payload);
    client.join(roomName);
    this.handleConnection(payload.userId, client);
    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    });
    this.currentId = payload.userId;
  }
  //发送消息
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString();

    const history = await this.chatHistoryService.add(payload.chatroomId, {
      content: payload.message.content,
      type: payload.message.type === 'image' ? 1 : 0,
      chatroomId: payload.chatroomId,
      senderId: payload.sendUserId,
    });
    const sender = await this.userService.findUserDetailById(history.senderId);
    // console.log('详细个人信息', sender);
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      userId: payload.sendUserId,
      message: { ...history, sender },
    });
  }

  async handleConnection(userId: number, client: Socket) {
    // console.log('设置连接userId', userId);
    this.userSocketMap.set(userId, client);
  }

  // handleDisconnect(client: Socket,server:Server ) {
  //   const userId = client.data.userId;
  //   if (userId) {
  //     this.userSocketMap.delete(userId);
  //     // 清理视频房间
  //     this.videoRooms.forEach((users, roomId) => {
  //       if (users.has(userId)) {
  //         users.delete(userId);
  //         if (users.size === 0) {
  //           this.videoRooms.delete(roomId);
  //         }
  //       }
  //     });
  //   }
  // }

  // @SubscribeMessage('videoCall')
  // async handleVideoCall(@MessageBody() payload: any) {
  //   // console.log(this.userSocketMap);
  //   const targetSocket = this.userSocketMap.get(payload.to);
  //   const fromSocket = this.userSocketMap.get(payload.from);

  //   // console.log('userSocketMap:', this.userSocketMap);
  //   console.log(
  //     '来自:',
  //     payload.from,
  //     '做什么:',
  //     payload.type,
  //     '到哪去：',
  //     payload.to,
  //   );
  //   if (targetSocket) {
  //     if (payload.type === 'offer') {
  //       console.log("payload.type === 'offer'");
  //       // 创建视频房间

  //       targetSocket.emit('videoCall', {
  //         type: 'offer',
  //         offer: payload.offer,
  //         from: payload.from, // ✅ 使用 payload 中的真实来源
  //         to: payload.to,
  //       });
  //       console.log(
  //         '来自:',
  //         payload.from,
  //         '做什么:',
  //         payload.type,
  //         '到哪去：',
  //         payload.to,
  //       );
  //     } else if (payload.type === 'answer') {
  //       // 处理 answer
  //       console.log('处理 answer 信令', payload.answer);
  //       targetSocket.emit('videoCall', {
  //         type: 'answer',
  //         answer: payload.answer,
  //         from: payload.from,
  //         to: payload.to,
  //         chatroomId: payload.chatroomId, // ✅ 必须传递
  //       });
  //     } else if (payload.type === 'candidate') {
  //       // 处理 ICE candidate
  //       console.log('处理 ICE candidate 信令');

  //       targetSocket.emit('videoCall', {
  //         type: 'candidate',
  //         candidate: payload.candidate,
  //         from: payload.from,
  //         to: payload.to, // ✅ 明确指定目标用户
  //         chatroomId: payload.chatroomId,
  //       });
  //     } else if (payload.type === 'request') {
  //       console.log('收到视频通话请求');
  //       console.log('payload:', payload);
  //       // 处理 request
  //       console.log('处理 request');

  //       targetSocket.emit('videoCall', {
  //         type: 'request',
  //         data: payload.data,
  //         from: this.currentId,
  //       });
  //     } else if (payload.type === 'accept') {
  //       // 处理 accept
  //       console.log('处理 accept', payload);

  //       targetSocket.emit('videoCall', {
  //         type: 'accept',
  //         data: payload.data,
  //         from: this.currentId,
  //         // fromName: payload.fromName,
  //       });
  //     } else if (payload.type === 'reject') {
  //       // 处理 reject
  //       console.log('处理 reject');
  //       const toId = payload.to;
  //       const toWs = this.userSocketMap.get(toId);
  //       const roomName = payload.chatroomId.toString();
  //       if (toWs) {
  //         targetSocket.emit('videoCall', {
  //           type: 'reject',
  //           data: payload.data,
  //           from: this.currentId,
  //           fromName: payload.fromName,
  //         });
  //       } else {
  //         console.error(`Remote peer ${toId} not found in room `);
  //       }
  //     }

  //     // console.log('payload', payload);
  //     // 转发信令数据
  //     // targetSocket.emit('videoCall', {
  //     //   ...payload,
  //     //   from: this.currentId,
  //     // });
  //   } else {
  //     fromSocket.emit('videoCall', {
  //       type: 'error',
  //       message: '对方不在线或无法建立连接',
  //       from: payload.to,
  //       to: this.currentId,
  //     });
  //   }
  // }
  @SubscribeMessage('videoCall')
  async handleVideoCall(@MessageBody() payload: any) {
    const targetSocket = this.userSocketMap.get(payload.to);
    const fromSocket = this.userSocketMap.get(payload.from);

    if (!targetSocket) {
      fromSocket?.emit('videoCall', {
        type: 'error',
        message: '对方不在线',
        from: payload.to,
        to: payload.from,
      });
      return;
    }

    // 统一添加 chatroomId 和正确 from/to
    const forwardPayload = {
      ...payload,
      chatroomId: payload.chatroomId,
      from: payload.from,
      to: payload.to,
    };

    // 根据类型处理
    switch (payload.type) {
      case 'offer':
      case 'answer':
      case 'candidate':
      case 'request':
      case 'accept':
      case 'reject':
        targetSocket.emit('videoCall', forwardPayload);
        break;
      default:
        fromSocket?.emit('videoCall', {
          type: 'error',
          message: '无效的信令类型',
        });
    }
  }
  @SubscribeMessage('endCall')
  async handleEndCall(client: Socket, payload: { from: number; to: number }) {
    const roomId = `video-${payload.from}-${payload.to}`;
    const room = this.videoRooms.get(roomId);

    if (room) {
      // 通知双方通话结束
      const targetSocket = this.userSocketMap.get(payload.to);
      if (targetSocket) {
        targetSocket.emit('videoCall', {
          type: 'end',
          from: payload.from,
          to: payload.to,
        });
      }

      // 清理房间
      this.videoRooms.delete(roomId);
    }
  }
}
