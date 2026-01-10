import { MediaService } from "./media.service";
import { Request } from "express";
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(): Promise<import("../entities/media.entity").Media[]>;
    getTutoriels(): Promise<import("../entities/media.entity").Media[]>;
    getAstuces(page: string, req: Request): Promise<{
        current_page: number;
        data: import("../entities/media.entity").Media[];
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
}
