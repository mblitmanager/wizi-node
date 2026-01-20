import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Media } from "../entities/media.entity";
import { Parrainage } from "../entities/parrainage.entity";
export declare class AchievementService {
    private achievementRepository;
    private stagiaireRepository;
    private stagiaireAchievementRepository;
    private progressionRepository;
    private quizRepository;
    private mediaStagiaireRepository;
    private mediaRepository;
    private parrainageRepository;
    constructor(achievementRepository: Repository<Achievement>, stagiaireRepository: Repository<Stagiaire>, stagiaireAchievementRepository: Repository<StagiaireAchievement>, progressionRepository: Repository<Progression>, quizRepository: Repository<Quiz>, mediaStagiaireRepository: Repository<MediaStagiaire>, mediaRepository: Repository<Media>, parrainageRepository: Repository<Parrainage>);
    getAchievements(stagiaireId: number): Promise<Achievement[]>;
    getAllAchievements(): Promise<Achievement[]>;
    unlockAchievementByCode(stagiaireId: number, code: string): Promise<Achievement[]>;
    checkAchievements(stagiaireId: number, quizId?: number): Promise<Achievement[]>;
    private isToday;
    private isYesterday;
    private getQuizStats;
    private getVideoStats;
}
