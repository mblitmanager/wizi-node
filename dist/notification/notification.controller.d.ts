import { NotificationService } from "./notification.service";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<{
        data: {
            id: number;
            message: string;
            data: any;
            type: string;
            title: string;
            read: boolean;
            user_id: number;
            created_at: string;
            updated_at: string;
        }[];
    }>;
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: number): Promise<import("typeorm").UpdateResult>;
    markAllAsRead(req: any): Promise<import("typeorm").UpdateResult>;
    deleteNotification(id: number): Promise<import("typeorm").DeleteResult>;
}
