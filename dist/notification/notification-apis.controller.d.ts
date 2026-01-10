import { MailService } from "../mail/mail.service";
export declare class NotificationsApiController {
    constructor();
    index(req: any): Promise<{
        data: any[];
        message: string;
    }>;
    unreadCount(): Promise<{
        count: number;
    }>;
    markAllRead(): Promise<{
        message: string;
    }>;
    markAsRead(id: number): Promise<{
        message: string;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
export declare class NotificationHistoryApiController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class ParrainageApiController {
    constructor();
    generateLink(): Promise<{
        link: string;
    }>;
    getData(token: string): Promise<{
        data: {};
        message: string;
    }>;
    registerFilleul(data: any): Promise<{
        message: string;
    }>;
    stats(): Promise<{
        data: {};
        message: string;
    }>;
}
export declare class AnnouncementsApiController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
    store(data: any): Promise<{
        message: string;
        data: any;
    }>;
    getRecipients(): Promise<{
        data: any[];
        message: string;
    }>;
    show(id: number): Promise<{
        data: {};
        message: string;
    }>;
    update(id: number, data: any): Promise<{
        message: string;
        data: any;
    }>;
    destroy(id: number): Promise<{
        message: string;
    }>;
}
export declare class AutoRemindersApiController {
    constructor();
    history(): Promise<{
        data: any[];
        message: string;
    }>;
    stats(): Promise<{
        data: {};
        message: string;
    }>;
    targeted(): Promise<{
        data: any[];
        message: string;
    }>;
    run(): Promise<{
        message: string;
    }>;
}
export declare class OnlineUsersApiController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class ContactApiController {
    constructor();
    sendContactForm(data: any): Promise<{
        message: string;
    }>;
}
export declare class EmailApiController {
    private mailService;
    constructor(mailService: MailService);
    send(data: any): Promise<{
        message: string;
    }>;
}
export declare class NotifyApiController {
    constructor();
    send(data: any): Promise<{
        message: string;
    }>;
}
export declare class SendDailyNotificationController {
    constructor();
    send(): Promise<{
        message: string;
    }>;
}
export declare class ParrainageEventsApiController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
}
