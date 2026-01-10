import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminMediaController {
    private mediaRepository;
    private apiResponse;
    constructor(mediaRepository: Repository<Media>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Media>>;
    findOne(id: number): Promise<any>;
    create(data: any, file?: Express.Multer.File): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
}
