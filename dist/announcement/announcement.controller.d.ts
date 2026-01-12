import { AnnouncementService } from "./announcement.service";
export declare class AnnouncementController {
    private announcementService;
    constructor(announcementService: AnnouncementService);
    index(req: any, page?: number, limit?: number): Promise<{
        data: import("../entities/announcement.entity").Announcement[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    store(req: any, body: any): Promise<{
        message: string;
        announcement: import("../entities/announcement.entity").Announcement;
        recipients_count: number;
    } | {
        message: string;
        announcement: import("../entities/announcement.entity").Announcement;
        recipients_count?: undefined;
    }>;
    getRecipients(req: any): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }[]>;
    show(id: number): Promise<import("../entities/announcement.entity").Announcement>;
    update(req: any, id: number, body: any): Promise<import("../entities/announcement.entity").Announcement>;
    destroy(req: any, id: number): Promise<{
        message: string;
    }>;
}
