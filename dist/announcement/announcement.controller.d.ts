import { AnnouncementService } from "./announcement.service";
export declare class AnnouncementController {
    private announcementService;
    constructor(announcementService: AnnouncementService);
    index(req: any, page?: string, limit?: string): Promise<{
        current_page: number;
        data: import("../entities/announcement.entity").Announcement[];
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
