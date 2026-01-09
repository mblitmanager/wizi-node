import { RankingService } from "./ranking.service";
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getGlobalRanking(): Promise<{
        rang: number;
        level: string;
        id: any;
        firstname: any;
        name: any;
        image: any;
        score: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
        formateurs: any;
    }[]>;
    getMyRanking(req: any): Promise<{
        rang: number;
        level: string;
        id: any;
        firstname: any;
        name: any;
        image: any;
        score: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
        formateurs: any;
    }>;
    getMyPoints(req: any): Promise<{
        points: any;
    }>;
}
