import { MailService } from "../mail/mail.service";
import { NotificationService } from "./notification.service";
import { ApiResponseService } from "../common/services/api-response.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
export declare class NotificationsApiController {
    private notificationService;
    private apiResponse;
    private userRepository;
    constructor(notificationService: NotificationService, apiResponse: ApiResponseService, userRepository: Repository<User>);
    index(req: any): Promise<any>;
    unreadCount(req: any): Promise<any>;
    markAllRead(req: any): Promise<any>;
    updateFcmToken(req: any, token: string): Promise<any>;
    markAsRead(id: number): Promise<any>;
    delete(id: number): Promise<any>;
}
export declare class NotificationHistoryApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
}
export declare class ParrainageApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    generateLink(): Promise<any>;
    getData(token: string): Promise<any>;
    registerFilleul(data: any): Promise<any>;
    stats(): Promise<any>;
}
export declare class AnnouncementsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
    store(data: any): Promise<any>;
    getRecipients(): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
}
export declare class AutoRemindersApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    history(): Promise<any>;
    stats(): Promise<any>;
    targeted(): Promise<any>;
    run(): Promise<any>;
}
export declare class OnlineUsersApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
}
export declare class ContactApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    sendContactForm(data: any): Promise<any>;
}
export declare class EmailApiController {
    private mailService;
    private apiResponse;
    constructor(mailService: MailService, apiResponse: ApiResponseService);
    send(data: any): Promise<any>;
}
export declare class NotifyApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    send(data: any): Promise<any>;
}
export declare class SendDailyNotificationController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    send(): Promise<any>;
}
export declare class ParrainageEventsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
}
