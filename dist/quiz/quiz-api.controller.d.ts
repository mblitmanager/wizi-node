import { ApiResponseService } from "../common/services/api-response.service";
import { RankingService } from "../ranking/ranking.service";
import { QuizService } from "./quiz.service";
import { AchievementService } from "../achievement/achievement.service";
export declare class QuizApiController {
    private rankingService;
    private quizService;
    private apiResponse;
    private achievementService;
    constructor(rankingService: RankingService, quizService: QuizService, apiResponse: ApiResponseService, achievementService: AchievementService);
    getAll(): Promise<any>;
    byFormations(req: any): Promise<{
        id: string;
        titre: string;
        description: string;
        categorie: string;
        quizzes: {
            id: string;
            titre: string;
            description: string;
            categorie: string;
            categorieId: string;
            niveau: string;
            questions: {
                id: string;
                text: string;
                type: string;
                answers: {
                    id: string;
                    text: string;
                    isCorrect: boolean;
                }[];
            }[];
            points: number;
        }[];
    }[]>;
    categories(): Promise<any>;
    byCategory(categoryId: string, req: any): Promise<any>;
    globalClassement(period?: string): Promise<{
        rang: number;
        stagiaire: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        };
        formateurs: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }[]>;
    history(req: any): Promise<{
        id: string;
        quiz: {
            id: number;
            titre: string;
            description: string;
            duree: string;
            niveau: string;
            status: string;
            nb_points_total: string;
            formation: {
                id: number;
                titre: string;
                description: string;
                duree: string;
                categorie: string;
            };
            questions: {
                id: string;
                quizId: number;
                text: string;
                type: string;
                explication: string;
                points: string;
                astuce: string;
                mediaUrl: string;
                answers: {
                    id: string;
                    text: string;
                    isCorrect: number;
                    position: number;
                    matchPair: string;
                    bankGroup: string;
                    flashcardBack: string;
                }[];
            }[];
        };
        score: number;
        completedAt: string;
        timeSpent: number;
        totalQuestions: number;
        correctAnswers: number;
    }[]>;
    stats(req: any): Promise<any>;
    statsCategories(req: any): Promise<any>;
    statsProgress(req: any): Promise<any>;
    statsPerformance(): Promise<any>;
    statsTrends(): Promise<any>;
    getById(id: number): Promise<any>;
    submitResult(id: number, body: any, req: any): Promise<any>;
    getQuestions(quizId: number): Promise<any>;
    submit(quizId: number, data: any): Promise<any>;
    getParticipation(quizId: number): Promise<any>;
    startParticipation(quizId: number): Promise<any>;
    saveProgress(quizId: number, data: any): Promise<any>;
    resumeParticipation(quizId: number): Promise<any>;
    complete(quizId: number): Promise<any>;
    getStatistics(quizId: number, req: any): Promise<any>;
    getUserParticipations(quizId: number): Promise<any>;
}
