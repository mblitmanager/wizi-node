import { Repository } from "typeorm";
import { Announcement } from "../entities/announcement.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Formateur } from "../entities/formateur.entity";
import { Commercial } from "../entities/commercial.entity";
import { NotificationService } from "../notification/notification.service";
export declare class AnnouncementService {
    private announcementRepository;
    private userRepository;
    private stagiaireRepository;
    private formateurRepository;
    private commercialRepository;
    private notificationService;
    constructor(announcementRepository: Repository<Announcement>, userRepository: Repository<User>, stagiaireRepository: Repository<Stagiaire>, formateurRepository: Repository<Formateur>, commercialRepository: Repository<Commercial>, notificationService: NotificationService);
    getAnnouncements(user: any, page?: number, limit?: number): Promise<{
        data: Announcement[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    createAnnouncement(data: any, user: any): Promise<{
        message: string;
        announcement: Announcement;
        recipients_count: number;
    } | {
        message: string;
        announcement: Announcement;
        recipients_count?: undefined;
    }>;
    deleteAnnouncement(id: number, user: any): Promise<{
        message: string;
    }>;
    getPotentialRecipients(user: any): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }[]>;
    private getScopedStagiaireUsers;
    private getRecipientsForImmediateSend;
}
