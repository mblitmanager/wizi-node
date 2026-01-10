import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
export declare class AdminMediaController {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Media[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Media>;
    create(data: any, file?: Express.Multer.File): Promise<Media[]>;
    update(id: number, data: any): Promise<Media>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
