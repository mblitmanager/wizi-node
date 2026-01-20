import { AppService } from "./app.service";
import { FcmService } from "./notification/fcm.service";
import { MailService } from "./mail/mail.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
export declare class AppController {
    private readonly appService;
    private readonly fcmService;
    private readonly mailService;
    private readonly userRepository;
    constructor(appService: AppService, fcmService: FcmService, mailService: MailService, userRepository: Repository<User>);
    testMail(to: string): Promise<{
        error: string;
        success?: undefined;
        message?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        message?: undefined;
    }>;
    testFcm(body: any): Promise<{
        ok: boolean;
        error?: undefined;
    } | {
        error: string;
        ok?: undefined;
    }>;
    testFcmGet(query: any): Promise<{
        ok: boolean;
        error?: undefined;
    } | {
        error: string;
        ok?: undefined;
    }>;
    private handleFcmRequest;
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
