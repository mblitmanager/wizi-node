import { Repository } from "typeorm";
import { Progression } from "../entities/progression.entity";
export declare class ProgressionService {
    private progressionRepository;
    constructor(progressionRepository: Repository<Progression>);
    findAll(page?: number, perPage?: number, baseUrl?: string): Promise<{
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
            time_spent: string;
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
        time_spent: string;
        completion_time: string;
        created_at: string;
        updated_at: string;
    }>;
}
