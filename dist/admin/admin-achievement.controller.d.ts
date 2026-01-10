import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminAchievementController {
    private achievementRepository;
    private apiResponse;
    constructor(achievementRepository: Repository<Achievement>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Achievement>>;
    delete(id: number): Promise<any>;
}
