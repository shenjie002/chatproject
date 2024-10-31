import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { BookModule } from './book/book.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { ChatModule } from './chat/chat.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    JwtModule.register({
      global: true,
      secret: 'guang',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    EmailModule,
    UserModule,

    BookModule,

    RedisModule,

    FriendshipModule,

    ChatroomModule,

    ChatHistoryModule,

    ChatModule,

    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
