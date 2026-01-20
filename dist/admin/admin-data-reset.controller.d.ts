import { Repository } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Progression } from "../entities/progression.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { ApiResponseService } from "../common/services/api-response.service";
interface ResetDataDto {
    dataTypes: string[];
    confirmation: boolean;
}
export declare class AdminDataResetController {
    private classementRepository;
    private progressionRepository;
    private achievementRepository;
    private participationRepository;
    private answerRepository;
    private apiResponse;
    constructor(classementRepository: Repository<Classement>, progressionRepository: Repository<Progression>, achievementRepository: Repository<StagiaireAchievement>, participationRepository: Repository<QuizParticipation>, answerRepository: Repository<QuizParticipationAnswer>, apiResponse: ApiResponseService);
    resetData(dto: ResetDataDto): Promise<any>;
}
export {};
