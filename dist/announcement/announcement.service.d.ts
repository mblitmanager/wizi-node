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
    getAnnouncements(user: any, page?: number, limit?: number, baseUrl?: string): Promise<{
        current_page: number;
        data: Announcement[];
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
    getAnnouncement(id: number): Promise<Announcement>;
    updateAnnouncement(id: number, data: any, user: any): Promise<Announcement>;
    getPotentialRecipients(user: any): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }[]>;
    private getScopedStagiaireUsers;
    private getRecipientsForImmediateSend;
}
