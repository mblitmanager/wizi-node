import { AchievementService } from "./achievement.service";
export declare class AchievementController {
    private readonly achievementService;
    constructor(achievementService: AchievementService);
    getAchievements(req: any): Promise<{
        achievements: import("../entities/achievement.entity").Achievement[];
    }>;
    getAllAchievements(): Promise<{
        achievements: import("../entities/achievement.entity").Achievement[];
    }>;
    checkAchievements(req: any, code?: string, quizId?: number): Promise<{
        new_achievements: any[];
    }>;
}
