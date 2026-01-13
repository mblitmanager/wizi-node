import { AppService } from "./app.service";
import { FcmService } from "./notification/fcm.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
export declare class AppController {
    private readonly appService;
    private readonly fcmService;
    private readonly userRepository;
    constructor(appService: AppService, fcmService: FcmService, userRepository: Repository<User>);
    testFcm(body: any): Promise<{
        ok: boolean;
        error?: undefined;
    } | {
        error: string;
        ok?: undefined;
    }>;
    getTestNotif(): string;
    getHello(): {
        name: string;
        version: string;
        status: string;
        documentation: string;
        message: string;
    };
    getAdminInterface(): string;
    getAdminRedirect(): string;
}
