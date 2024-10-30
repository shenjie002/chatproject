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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const redis_service_1 = require("../redis/redis.service");
let UserService = class UserService {
    async register(data) {
        delete data.emailCode;
        const hasUser = await this.prisma.user.findUnique({
            where: {
                name: data.name,
            },
        });
        console.log('hasUser', hasUser);
        if (hasUser) {
            throw new common_1.HttpException({
                status: 402,
                message: {
                    name: '用户已存在',
                },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const createData = await this.prisma.user.create({
            data,
        });
        return {
            code: 200,
            ok: 'success',
        };
    }
    async login(data) {
        console.log('Controller传来的值', data);
        const hasUser = await this.prisma.user.findUnique({
            where: {
                name: data.name,
            },
        });
        console.log(hasUser);
        if (!hasUser) {
            throw new common_1.HttpException({
                status: 404,
                message: {
                    name: '用户不存在',
                },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (hasUser.password !== data.password) {
            throw new common_1.HttpException({
                status: 401,
                message: {
                    password: '密码不正确',
                },
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return hasUser;
    }
    async findUserDetailById(id) {
        const data = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return data;
    }
};
exports.UserService = UserService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], UserService.prototype, "prisma", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map