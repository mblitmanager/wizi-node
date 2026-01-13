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
    getNotifications(userId: number): Promise<{
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
    markAsRead(notificationId: number): Promise<import("typeorm").UpdateResult>;
    getUnreadCount(userId: number): Promise<number>;
    markAllAsRead(userId: number): Promise<import("typeorm").UpdateResult>;
    deleteNotification(notificationId: number): Promise<import("typeorm").DeleteResult>;
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
    getNotificationHistoryPaginated(userId: number, page?: number, perPage?: number, baseUrl?: string): Promise<{
        current_page: number;
        data: any[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }>;
    private formatPagination;
    private generateLinks;
    private formatIso;
    private formatDateTime;
}
