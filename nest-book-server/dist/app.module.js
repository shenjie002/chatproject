"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma.service");
const user_module_1 = require("./user/user.module");
const user_service_1 = require("./user/user.service");
const book_module_1 = require("./book/book.module");
const email_module_1 = require("./email/email.module");
const config_1 = require("@nestjs/config");
const redis_module_1 = require("./redis/redis.module");
const jwt_1 = require("@nestjs/jwt");
const friendship_module_1 = require("./friendship/friendship.module");
const chatroom_module_1 = require("./chatroom/chatroom.module");
const chat_history_module_1 = require("./chat-history/chat-history.module");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: 'src/.env',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: 'guang',
                signOptions: {
                    expiresIn: '7d',
                },
            }),
            email_module_1.EmailModule,
            user_module_1.UserModule,
            book_module_1.BookModule,
            redis_module_1.RedisModule,
            friendship_module_1.FriendshipModule,
            chatroom_module_1.ChatroomModule,
            chat_history_module_1.ChatHistoryModule,
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, user_service_1.UserService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map