import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
export declare class AdminAchievementController {
    private achievementRepository;
    constructor(achievementRepository: Repository<Achievement>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Achievement[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
}
