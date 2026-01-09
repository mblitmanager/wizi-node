import { NotificationService } from "./notification.service";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<import("../entities/notification.entity").Notification[]>;
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: number): Promise<import("typeorm").UpdateResult>;
    markAllAsRead(req: any): Promise<import("typeorm").UpdateResult>;
}
