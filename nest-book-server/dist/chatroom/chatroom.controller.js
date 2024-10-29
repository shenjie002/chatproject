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
exports.ChatroomController = void 0;
const common_1 = require("@nestjs/common");
const chatroom_service_1 = require("./chatroom.service");
const custom_decorator_1 = require("../custom.decorator");
const login_guard_1 = require("../login.guard");
let ChatroomController = class ChatroomController {
    constructor(chatroomService) {
        this.chatroomService = chatroomService;
    }
    async oneToOne(friendId_, userId) {
        const friendId = parseInt(friendId_);
        if (!friendId) {
            throw new common_1.BadRequestException('聊天好友的 id 不能为空');
        }
        return this.chatroomService.createOneToOneChatroom(friendId, userId);
    }
    async group(name, userId) {
        return this.chatroomService.createGroupChatroom(name, userId);
    }
    async list(userId, name) {
        if (!userId) {
            throw new common_1.HttpException({
                status: 402,
                message: {
                    emailCode: 'userId 不能为空',
                },
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const list = await this.chatroomService.list(userId, name);
        return {
            code: 200,
            ok: 'success',
            list: list,
        };
    }
    async members(chatroomId_) {
        const chatroomId = parseInt(chatroomId_);
        if (!chatroomId) {
            throw new common_1.BadRequestException('chatroomId 不能为空');
        }
        return this.chatroomService.members(chatroomId);
    }
    async info(id_) {
        const id = parseInt(id_);
        if (!id) {
            throw new common_1.BadRequestException('id 不能为空');
        }
        return this.chatroomService.info(id);
    }
    async join(id_, joinUserId_) {
        const id = parseInt(id_);
        const joinUserId = parseInt(joinUserId_);
        if (!id) {
            throw new common_1.BadRequestException('id 不能为空');
        }
        if (!joinUserId) {
            throw new common_1.BadRequestException('joinUserId 不能为空');
        }
        return this.chatroomService.join(id, joinUserId);
    }
    async quit(id_, quitUserId_) {
        const id = parseInt(id_);
        const quitUserId = parseInt(quitUserId_);
        if (!id) {
            throw new common_1.BadRequestException('id 不能为空');
        }
        if (!quitUserId) {
            throw new common_1.BadRequestException('quitUserId 不能为空');
        }
        return this.chatroomService.quit(id, quitUserId);
    }
};
exports.ChatroomController = ChatroomController;
__decorate([
    (0, common_1.Get)('create-one-to-one'),
    __param(0, (0, common_1.Query)('friendId')),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "oneToOne", null);
__decorate([
    (0, common_1.Get)('create-group'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "group", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, custom_decorator_1.UserInfo)('id')),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('members'),
    __param(0, (0, common_1.Query)('chatroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "members", null);
__decorate([
    (0, common_1.Get)('info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "info", null);
__decorate([
    (0, common_1.Get)('join/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('joinUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "join", null);
__decorate([
    (0, common_1.Get)('quit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('quitUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "quit", null);
exports.ChatroomController = ChatroomController = __decorate([
    (0, common_1.Controller)('chatroom'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __metadata("design:paramtypes", [chatroom_service_1.ChatroomService])
], ChatroomController);
//# sourceMappingURL=chatroom.controller.js.map