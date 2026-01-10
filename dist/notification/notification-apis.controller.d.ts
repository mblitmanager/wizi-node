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
    index(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<import("../entities/notification.entity").Notification[]>>;
    unreadCount(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        count: number;
    }>>;
    markAllRead(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
    updateFcmToken(req: any, token: string): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
    markAsRead(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
    delete(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class NotificationHistoryApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class ParrainageApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    generateLink(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        link: string;
    }>>;
    getData(token: string): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    registerFilleul(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
    stats(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
}
export declare class AnnouncementsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    store(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    getRecipients(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    show(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    destroy(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class AutoRemindersApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    history(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    stats(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    targeted(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    run(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class OnlineUsersApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class ContactApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    sendContactForm(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class EmailApiController {
    private mailService;
    private apiResponse;
    constructor(mailService: MailService, apiResponse: ApiResponseService);
    send(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class NotifyApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    send(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class SendDailyNotificationController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    send(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        message: string;
    }>>;
}
export declare class ParrainageEventsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
