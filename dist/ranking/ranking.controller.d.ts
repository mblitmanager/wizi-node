import { RankingService } from "./ranking.service";
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getFormationsRankingSummary(): Promise<{
        formations: any[];
    }>;
    getGlobalRanking(): Promise<{
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
    getMyRanking(req: any): Promise<{
        rang: number;
        level: string;
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
    } | {
        stagiaire: {
            id: string;
            prenom: string;
            image: any;
        };
        totalPoints: number;
        quizCount: number;
        averageScore: number;
        rang: number;
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
        rank: number;
    } | {
        points: number;
        completed_quizzes: number;
        completed_challenges: number;
        rank?: undefined;
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
        completedQuizzes: number;
        totalTimeSpent: number;
        rang: number;
        level: number;
        categoryStats: {
            category: string;
            quizCount: number;
            averageScore: number;
        }[];
        levelProgress: {
            débutant: {
                completed: number;
                averageScore: number;
            };
            intermédiaire: {
                completed: number;
                averageScore: number;
            };
            avancé: {
                completed: number;
                averageScore: number;
            };
        };
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
            level: string;
            byLevel: {
                débutant: {
                    completed: number;
                    averageScore: number;
                };
                intermédiaire: {
                    completed: number;
                    averageScore: number;
                };
                avancé: {
                    completed: number;
                    averageScore: number;
                };
            };
            lastActivity: Date;
        };
    }>;
}
