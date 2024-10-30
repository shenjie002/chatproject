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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const socket_io_1 = require("socket.io");
const chat_history_service_1 = require("../chat-history/chat-history.service");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    joinRoom(client, payload) {
        const roomName = payload.chatroomId.toString();
        client.join(roomName);
        this.server.to(roomName).emit('message', {
            type: 'joinRoom',
            userId: payload.userId,
        });
    }
    async sendMessage(payload) {
        const roomName = payload.chatroomId.toString();
        const history = await this.chatHistoryService.add(payload.chatroomId, {
            content: payload.message.content,
            type: payload.message.type === 'image' ? 1 : 0,
            chatroomId: payload.chatroomId,
            senderId: payload.sendUserId,
        });
        const sender = await this.userService.findUserDetailById(history.senderId);
        console.log('详细个人信息', sender);
        this.server.to(roomName).emit('message', {
            type: 'sendMessage',
            userId: payload.sendUserId,
            message: { ...history, sender },
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], ChatGateway.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(chat_history_service_1.ChatHistoryService),
    __metadata("design:type", chat_history_service_1.ChatHistoryService)
], ChatGateway.prototype, "chatHistoryService", void 0);
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map