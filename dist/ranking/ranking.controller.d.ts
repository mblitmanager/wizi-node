import { RankingService } from "./ranking.service";
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getGlobalRanking(): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }[]>;
    getMyRanking(req: any): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }>;
    getMyPoints(req: any): Promise<{
        totalPoints: number;
        accessibleLevels: string[];
    }>;
    getFormationRanking(formationId: number): Promise<{
        id: number;
        name: string;
        points: number;
        rang: number;
    }[]>;
    getMyRewards(req: any): Promise<{
        points: number;
        completed_quizzes: number;
        completed_challenges: number;
    }>;
    getMyProgress(req: any): Promise<{
        stagiaire: {
            id: string;
            prenom: string;
            image: string;
        };
        totalPoints: any;
        quizCount: number;
        averageScore: number;
        completedQuizzes: any;
        totalTimeSpent: number;
        rang: number;
        level: number;
    }>;
    getStagiaireDetails(stagiaireId: number): Promise<{
        id: number;
        firstname: string;
        name: string;
        avatar: string;
        rang: number;
        totalPoints: number;
        formations: {
            id: number;
            titre: string;
        }[];
        formateurs: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        }[];
        quizStats: {
            totalCompleted: number;
            totalQuiz: number;
            pourcentageReussite: number;
            byLevel: {
                debutant: {
                    completed: number;
                    total: number;
                };
                intermediaire: {
                    completed: number;
                    total: number;
                };
                expert: {
                    completed: number;
                    total: number;
                };
            };
            lastActivity: Date;
        };
    }>;
}
