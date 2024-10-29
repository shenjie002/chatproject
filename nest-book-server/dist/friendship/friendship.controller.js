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
exports.FriendshipController = void 0;
const common_1 = require("@nestjs/common");
const friendship_service_1 = require("./friendship.service");
const friend_add_dto_1 = require("./dto/friend-add.dto");
const custom_decorator_1 = require("../custom.decorator");
const login_guard_1 = require("../login.guard");
let FriendshipController = class FriendshipController {
    constructor(friendshipService) {
        this.friendshipService = friendshipService;
    }
    async add(friendAddDto, userId) {
        const data = await this.friendshipService.add(friendAddDto, userId);
        return {
            code: 200,
            ok: '添加成功',
            data: data,
        };
    }
    async list(userId) {
        return this.friendshipService.list(userId);
    }
    async agree(friendId_, userId_) {
        const userId = parseInt(userId_);
        const friendId = parseInt(friendId_);
        if (!friendId) {
            throw new common_1.BadRequestException('添加的好友 id 不能为空');
        }
        return this.friendshipService.agree(friendId, userId);
    }
    async reject(friendId_, userId_) {
        const userId = parseInt(userId_);
        const friendId = parseInt(friendId_);
        if (!friendId) {
            throw new common_1.BadRequestException('添加的好友 id 不能为空');
        }
        return this.friendshipService.reject(friendId, userId);
    }
    async friendship(userId_, name) {
        const userId = parseInt(userId_);
        return this.friendshipService.getFriendship(userId, name);
    }
    async remove(friendId_, userId) {
        const friendId = parseInt(friendId_);
        return this.friendshipService.remove(friendId, userId);
    }
};
exports.FriendshipController = FriendshipController;
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [friend_add_dto_1.FriendAddDto, Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('request_list'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('agree/:id'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "agree", null);
__decorate([
    (0, common_1.Get)('reject/:id'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, custom_decorator_1.UserInfo)('id')),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "friendship", null);
__decorate([
    (0, common_1.Get)('remove/:id'),
    (0, common_1.UseGuards)(login_guard_1.LoginGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, custom_decorator_1.UserInfo)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "remove", null);
exports.FriendshipController = FriendshipController = __decorate([
    (0, common_1.Controller)('friendship'),
    __metadata("design:paramtypes", [friendship_service_1.FriendshipService])
], FriendshipController);
//# sourceMappingURL=friendship.controller.js.map