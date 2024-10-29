import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class LoginGuard implements CanActivate {
    private jwtService;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
