import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminMediaController {
    private mediaRepository;
    private apiResponse;
    constructor(mediaRepository: Repository<Media>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Media>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Media>>;
    create(data: any, file?: Express.Multer.File): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Media[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Media>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
