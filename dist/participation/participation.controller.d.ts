import { ParticipationService } from "./participation.service";
export declare class ParticipationController {
    private readonly participationService;
    constructor(participationService: ParticipationService);
    findAll(page: string, req: any): Promise<{
        "hydra:member": {
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
        "hydra:totalItems": number;
        "hydra:view": {
            "@id": string;
            "@type": string;
            "hydra:first": string;
            "hydra:last": string;
            "hydra:next": string;
            "hydra:previous": string;
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
