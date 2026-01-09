import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
export declare class NotificationService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createNotification(userId: number, type: string, message: string, data?: any): Promise<Notification>;
    getNotifications(userId: number): Promise<Notification[]>;
    markAsRead(notificationId: number): Promise<import("typeorm").UpdateResult>;
    markAllAsRead(userId: number): Promise<import("typeorm").UpdateResult>;
}
