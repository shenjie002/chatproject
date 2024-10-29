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
exports.ChatHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ChatHistoryService = class ChatHistoryService {
    async list(chatroomId) {
        const history = await this.prismaService.chatHistory.findMany({
            where: {
                chatroomId,
            },
        });
        const res = [];
        for (let i = 0; i < history.length; i++) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: history[i].senderId,
                },
                select: {
                    id: true,
                    name: true,
                    nick_name: true,
                    email: true,
                    createTime: true,
                    headPic: true,
                },
            });
            res.push({
                ...history[i],
                sender: user,
            });
        }
        return {
            code: 200,
            ok: '查询成功！',
            res,
        };
    }
    async add(chatroomId, history) {
        return this.prismaService.chatHistory.create({
            data: history,
        });
    }
};
exports.ChatHistoryService = ChatHistoryService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], ChatHistoryService.prototype, "prismaService", void 0);
exports.ChatHistoryService = ChatHistoryService = __decorate([
    (0, common_1.Injectable)()
], ChatHistoryService);
//# sourceMappingURL=chat-history.service.js.map