import { AchievementService } from "./achievement.service";
export declare class AchievementController {
    private readonly achievementService;
    constructor(achievementService: AchievementService);
    getAchievements(req: any): Promise<import("../entities/achievement.entity").Achievement[]>;
    getAllAchievements(): Promise<import("../entities/achievement.entity").Achievement[]>;
    checkAchievements(req: any, code?: string, quizId?: number): Promise<any[]>;
}
