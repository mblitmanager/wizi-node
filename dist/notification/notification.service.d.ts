import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { FcmService } from "./fcm.service";
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private fcmService;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, fcmService: FcmService);
    createNotification(userId: number, type: string, message: string, data?: any): Promise<Notification>;
    getNotifications(userId: number): Promise<Notification[]>;
    markAsRead(notificationId: number): Promise<import("typeorm").UpdateResult>;
    getUnreadCount(userId: number): Promise<number>;
    markAllAsRead(userId: number): Promise<import("typeorm").UpdateResult>;
}
