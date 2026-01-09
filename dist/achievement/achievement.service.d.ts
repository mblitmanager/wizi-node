import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class AchievementService {
    private achievementRepository;
    private stagiaireRepository;
    constructor(achievementRepository: Repository<Achievement>, stagiaireRepository: Repository<Stagiaire>);
    getAchievements(stagiaireId: number): Promise<Achievement[]>;
    getAllAchievements(): Promise<Achievement[]>;
    unlockAchievementByCode(stagiaireId: number, code: string): Promise<Achievement[]>;
    checkAchievements(stagiaireId: number, quizId?: number): Promise<any[]>;
}
