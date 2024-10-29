"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let FriendshipService = class FriendshipService {
    async add(friendAddDto, userId) {
        console.log('friendAddDto', friendAddDto, userId);
        const friend = await this.prismaService.user.findUnique({
            where: {
                name: friendAddDto.name,
            },
        });
        console.log('friend', friend);
        if (!friend) {
            throw new common_1.BadRequestException('要添加的 username 不存在');
        }
        if (friend.id === userId) {
            throw new common_1.BadRequestException('不能添加自己为好友');
        }
        const found = await this.prismaService.friendship.findMany({
            where: {
                userId,
                friendId: friend.id,
            },
        });
        console.log('found', found);
        if (found.length) {
            throw new common_1.BadRequestException('该好友已经添加过');
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
    async list(userId) {
        const findLatestMatchedItems = (data) => {
            const matchedItems = [];
            data.forEach((item1, index1) => {
                data.forEach((item2, index2) => {
                    if (index1 !== index2 &&
                        item1.toUserId === item2.toUserId &&
                        item1.fromUserId === item2.fromUserId) {
                        const time1 = new Date(item1.createTime).getTime();
                        const time2 = new Date(item2.createTime).getTime();
                        const latestItem = time1 > time2 ? item1 : item2;
                        matchedItems.push(latestItem);
                    }
                });
            });
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
            toMe: [],
            fromMe: [],
        };
        console.log(findLatestMatchedItems(fromMeRequest), findLatestMatchedItems(toMeRequest));
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
    async agree(friendId, userId) {
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
    async reject(friendId, userId) {
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
    async getFriendship(userId, name) {
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
        const set = new Set();
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
        return res.filter((item) => item.nick_name.includes(name));
    }
    async remove(friendId, userId) {
        await this.prismaService.friendship.deleteMany({
            where: {
                userId,
                friendId,
            },
        });
        return '删除成功';
    }
};
exports.FriendshipService = FriendshipService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], FriendshipService.prototype, "prismaService", void 0);
exports.FriendshipService = FriendshipService = __decorate([
    (0, common_1.Injectable)()
], FriendshipService);
//# sourceMappingURL=friendship.service.js.map