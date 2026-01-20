import { RankingService } from "./ranking.service";
export declare class ClassementsApiController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getAll(page?: string, limit?: string): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        totalItems: number;
        member: {
            "@id": string;
            "@type": string;
            id: number;
            rang: number;
            points: string;
            createdAt: string;
            updatedAt: string;
            stagiaire: string;
            quiz: string;
        }[];
        view: {
            "@id": string;
            "@type": string;
            first: string;
            last: string;
            next: string;
        };
    }>;
}
