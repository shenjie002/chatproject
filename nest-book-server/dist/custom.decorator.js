"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = exports.RequireLogin = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const RequireLogin = () => (0, common_1.SetMetadata)('require-login', true);
exports.RequireLogin = RequireLogin;
exports.UserInfo = (0, common_2.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request登录装饰器', request.user);
    if (!request.user) {
        return null;
    }
    return data ? request.user[data] : request.user;
});
//# sourceMappingURL=custom.decorator.js.map