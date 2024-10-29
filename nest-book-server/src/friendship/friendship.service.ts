import { FriendAddDto } from './dto/friend-add.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(friendAddDto: FriendAddDto, userId: number) {
    console.log('friendAddDto', friendAddDto, userId);
    const friend = await this.prismaService.user.findUnique({
      where: {
        name: friendAddDto.name,
      },
    });
    console.log('friend', friend);
    if (!friend) {
      throw new BadRequestException('要添加的 username 不存在');
    }

    if (friend.id === userId) {
      throw new BadRequestException('不能添加自己为好友');
    }

    const found = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId: friend.id,
      },
    });
    console.log('found', found);
    if (found.length) {
      throw new BadRequestException('该好友已经添加过');
    }

    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friend.id,
        reason: friendAddDto.reason,
        status: 0,
      },
    });
  }

  async list(userId: number) {
    // 查找所有符合条件的配对项，并返回createTime最晚的项组成的数组
    const findLatestMatchedItems = (data) => {
      const matchedItems = [];

      data.forEach((item1, index1) => {
        data.forEach((item2, index2) => {
          if (
            index1 !== index2 &&
            item1.toUserId === item2.toUserId &&
            item1.fromUserId === item2.fromUserId
          ) {
            // 将配对中createTime最晚的项添加到结果数组中
            const time1 = new Date(item1.createTime).getTime();
            const time2 = new Date(item2.createTime).getTime();
            const latestItem = time1 > time2 ? item1 : item2;
            matchedItems.push(latestItem);
          }
        });
      });

      // 移除重复项，因为同一对可能被添加了两次
      const uniqueMatchedItems = [
        ...new Map(matchedItems.map((item) => [item.id, item])).values(),
      ];

      return uniqueMatchedItems;
    };

    const fromMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });

    const toMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
    });

    const res = {
      toMe: [], //我发的
      fromMe: [], //发给我的
    };
    console.log(
      findLatestMatchedItems(fromMeRequest),
      findLatestMatchedItems(toMeRequest),
    );
    for (let i = 0; i < fromMeRequest.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: fromMeRequest[i].toUserId,
        },
        select: {
          id: true,
          name: true,
          nick_name: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
      res.fromMe.push({
        ...fromMeRequest[i],
        toUser: user,
      });
    }

    for (let i = 0; i < toMeRequest.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: toMeRequest[i].fromUserId,
        },
        select: {
          id: true,
          name: true,
          nick_name: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
      res.toMe.push({
        ...toMeRequest[i],
        fromUser: user,
      });
    }

    return res;
  }

  async agree(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (!res.length) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId,
        },
      });
    }
    return {
      code: 200,
      ok: '添加成功',
    };
  }

  async reject(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
    return {
      code: 200,
      ok: '已拒绝',
    };
  }
  //好友列表
  async getFriendship(userId: number, name: string) {
    // console.log('userId', userId);
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });
    console.log('friends', friends);
    const set = new Set<number>();
    for (let i = 0; i < friends.length; i++) {
      set.add(friends[i].userId);
      set.add(friends[i].friendId);
    }

    const friendIds = [...set].filter((item) => item !== userId);

    const res = [];

    for (let i = 0; i < friendIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          name: true,
          nick_name: true,
          email: true,
        },
      });
      res.push(user);
    }

    return res.filter((item: any) => item.nick_name.includes(name));
  }
  async remove(friendId: number, userId: number) {
    await this.prismaService.friendship.deleteMany({
      where: {
        userId,
        friendId,
      },
    });
    return '删除成功';
  }
}
