import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
declare const SyncAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SyncAuthGuard extends SyncAuthGuard_base {
    private configService;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    handleRequest(err: any, user: any, info: any): any;
}
export {};
