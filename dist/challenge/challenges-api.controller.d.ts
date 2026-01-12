import { ChallengeService } from "./challenge.service";
export declare class ChallengesApiController {
    private readonly challengeService;
    constructor(challengeService: ChallengeService);
    getAll(page?: string, limit?: string): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        totalItems: number;
        member: {
            "@id": string;
            "@type": string;
            id: number;
            titre: string;
            description: string;
            date_debut: string;
            date_fin: string;
            points: string;
            participation_id: number;
            createdAt: string;
            updatedAt: string;
        }[];
        view: {
            "@id": string;
            "@type": string;
            first: string;
            last: string;
            next: string;
        };
    }>;
    getOne(id: number): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        date_debut: string;
        date_fin: string;
        points: string;
        participation_id: number;
        createdAt: string;
        updatedAt: string;
    }>;
    create(data: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        date_debut: string;
        date_fin: string;
        points: string;
        participation_id: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: number, data: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        date_debut: string;
        date_fin: string;
        points: string;
        participation_id: number;
        createdAt: string;
        updatedAt: string;
    }>;
    delete(id: number): Promise<any>;
}
