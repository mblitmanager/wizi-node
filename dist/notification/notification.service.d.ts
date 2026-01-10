import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { FcmService } from "./fcm.service";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private parrainageEventRepository;
    private fcmService;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, parrainageEventRepository: Repository<ParrainageEvent>, fcmService: FcmService);
    createNotification(userId: number, type: string, message: string, data?: any, title?: string): Promise<Notification>;
    getNotifications(userId: number): Promise<Notification[]>;
    markAsRead(notificationId: number): Promise<import("typeorm").UpdateResult>;
    getUnreadCount(userId: number): Promise<number>;
    markAllAsRead(userId: number): Promise<import("typeorm").UpdateResult>;
    getParrainageEvents(): Promise<{
        id: number;
        titre: string;
        prix: string;
        date_debut: string;
        date_fin: string;
        created_at: string;
        updated_at: string;
        status: string;
    }[]>;
}
