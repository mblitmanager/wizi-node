import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export declare class FcmService implements OnModuleInit {
    private configService;
    private firebaseApp;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendPushNotification(token: string, title: string, body: string, data?: any): Promise<boolean>;
}
