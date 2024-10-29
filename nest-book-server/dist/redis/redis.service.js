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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    async keys(pattern) {
        return await this.redisClient.keys(pattern);
    }
    async get(key) {
        return await this.redisClient.get(key);
    }
    async set(key, value, ttl) {
        await this.redisClient.set(key, value);
        if (ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
    async sAdd(key, ...members) {
        return this.redisClient.sAdd(key, members);
    }
    async sInterStore(newSetKey, set1, set2) {
        return this.redisClient.sInterStore(newSetKey, [set1, set2]);
    }
    async sIsMember(key, member) {
        return this.redisClient.sIsMember(key, member);
    }
    async sMember(key) {
        return this.redisClient.sMembers(key);
    }
    async exists(key) {
        const result = await this.redisClient.exists(key);
        return result > 0;
    }
};
exports.RedisService = RedisService;
__decorate([
    (0, common_1.Inject)('REDIS_CLIENT'),
    __metadata("design:type", Object)
], RedisService.prototype, "redisClient", void 0);
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map