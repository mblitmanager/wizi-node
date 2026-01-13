import { ProgressionService } from "./progression.service";
export declare class ProgressionController {
    private readonly progressionService;
    constructor(progressionService: ProgressionService);
    findAll(page: string, req: any): Promise<{
        "hydra:member": {
            "@id": string;
            "@type": string;
            id: number;
            termine: boolean;
            stagiaire_id: string;
            quiz_id: string;
            formation_id: string;
            pourcentage: number;
            explication: string;
            score: number;
            correct_answers: number;
            total_questions: number;
            time_spent: number;
            completion_time: string;
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
        termine: boolean;
        stagiaire_id: string;
        quiz_id: string;
        formation_id: string;
        pourcentage: number;
        explication: string;
        score: number;
        correct_answers: number;
        total_questions: number;
        time_spent: number;
        completion_time: string;
        created_at: string;
        updated_at: string;
    }>;
}
