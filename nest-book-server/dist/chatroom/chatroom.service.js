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
exports.ChatroomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ChatroomService = class ChatroomService {
    async createOneToOneChatroom(friendId, userId_) {
        const userId = parseInt(userId_);
        const { id } = await this.prismaService.chatroom.create({
            data: {
                name: '聊天室' + Math.random().toString().slice(2, 8),
                type: false,
            },
            select: {
                id: true,
            },
        });
        await this.prismaService.userChatroom.create({
            data: {
                userId: userId,
                chatroomId: id,
            },
        });
        await this.prismaService.userChatroom.create({
            data: {
                userId: friendId,
                chatroomId: id,
            },
        });
        return '创建成功';
    }
    async createGroupChatroom(name, userId) {
        const { id } = await this.prismaService.chatroom.create({
            data: {
                name,
                type: true,
            },
        });
        await this.prismaService.userChatroom.create({
            data: {
                userId,
                chatroomId: id,
            },
        });
        return '创建成功';
    }
    async list(userId, name) {
        const chatroomIds = await this.prismaService.userChatroom.findMany({
            where: {
                userId,
            },
            select: {
                chatroomId: true,
            },
        });
        const chatrooms = await this.prismaService.chatroom.findMany({
            where: {
                id: {
                    in: chatroomIds.map((item) => item.chatroomId),
                },
                name: {
                    contains: name,
                },
            },
            select: {
                id: true,
                name: true,
                type: true,
                createTime: true,
            },
        });
        const res = [];
        for (let i = 0; i < chatrooms.length; i++) {
            const userIds = await this.prismaService.userChatroom.findMany({
                where: {
                    chatroomId: chatrooms[i].id,
                },
                select: {
                    userId: true,
                },
            });
            res.push({
                ...chatrooms[i],
                userCount: userIds.length,
                userIds: userIds.map((item) => item.userId),
            });
        }
        return res;
    }
    async members(chatroomId) {
        const userIds = await this.prismaService.userChatroom.findMany({
            where: {
                chatroomId,
            },
            select: {
                userId: true,
            },
        });
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: userIds.map((item) => item.userId),
                },
            },
            select: {
                id: true,
                name: true,
                nick_name: true,
                headPic: true,
                createTime: true,
                email: true,
            },
        });
        return users;
    }
    async info(id) {
        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                id,
            },
        });
        return { ...chatroom, users: await this.members(id) };
    }
    async join(id, userId) {
        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                id,
            },
        });
        if (chatroom.type === false) {
            throw new common_1.BadRequestException('一对一聊天室不能加人');
        }
        await this.prismaService.userChatroom.create({
            data: {
                userId,
                chatroomId: id,
            },
        });
        return '加入成功';
    }
    async quit(id, userId) {
        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                id,
            },
        });
        if (chatroom.type === false) {
            throw new common_1.BadRequestException('一对一聊天室不能退出');
        }
        await this.prismaService.userChatroom.deleteMany({
            where: {
                userId,
                chatroomId: id,
            },
        });
        return '退出成功';
    }
};
exports.ChatroomService = ChatroomService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], ChatroomService.prototype, "prismaService", void 0);
exports.ChatroomService = ChatroomService = __decorate([
    (0, common_1.Injectable)()
], ChatroomService);
//# sourceMappingURL=chatroom.service.js.map