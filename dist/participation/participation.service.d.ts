import { Repository } from "typeorm";
import { Participation } from "../entities/participation.entity";
export declare class ParticipationService {
    private participationRepository;
    constructor(participationRepository: Repository<Participation>);
    findAll(page?: number, perPage?: number, baseUrl?: string): Promise<{
        member: {
            "@id": string;
            "@type": string;
            id: number;
            stagiaire_id: string;
            quiz_id: string;
            date: string;
            heure: string;
            score: number;
            deja_jouer: boolean;
            current_question_id: number;
            created_at: string;
            updated_at: string;
        }[];
        totalItems: number;
        view: {
            "@id": string;
            "@type": string;
            first: string;
            last: string;
            next: string;
            previous: string;
        };
    }>;
    findOne(id: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        stagiaire_id: string;
        quiz_id: string;
        date: string;
        heure: string;
        score: number;
        deja_jouer: boolean;
        current_question_id: number;
        created_at: string;
        updated_at: string;
    }>;
}
