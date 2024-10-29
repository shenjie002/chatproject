interface JwtUserData {
    userId: number;
    name: string;
}
export declare const RequireLogin: () => import("@nestjs/common").CustomDecorator<string>;
declare module 'express' {
    interface Request {
        user: JwtUserData;
    }
}
export declare const UserInfo: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export {};
