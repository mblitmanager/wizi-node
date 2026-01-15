import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminAchievementController {
    private achievementRepository;
    private apiResponse;
    constructor(achievementRepository: Repository<Achievement>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    findOne(id: number): Promise<any>;
    create(body: {
        name: string;
        description?: string;
        icon?: string;
        level?: string;
    }): Promise<any>;
    update(id: number, body: {
        name?: string;
        description?: string;
        icon?: string;
        level?: string;
    }): Promise<any>;
    delete(id: number): Promise<any>;
}
