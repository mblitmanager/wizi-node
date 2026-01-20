import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { ApiResponseService } from "../common/services/api-response.service";
import { S3StorageService } from "../common/services/s3-storage.service";
export declare class AdminMediaController {
    private mediaRepository;
    private apiResponse;
    private s3Storage;
    constructor(mediaRepository: Repository<Media>, apiResponse: ApiResponseService, s3Storage: S3StorageService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Media>>;
    findOne(id: number): Promise<any>;
    create(data: any, file?: Express.Multer.File): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
}
