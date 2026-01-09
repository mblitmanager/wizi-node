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
}
