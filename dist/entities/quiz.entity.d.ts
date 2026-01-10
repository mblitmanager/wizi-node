import { Formation } from "./formation.entity";
import { Question } from "./question.entity";
export declare class Quiz {
    id: number;
    titre: string;
    description: string;
    niveau: string;
    duree: string;
    nb_points_total: string;
    status: string;
    formation_id: number;
    formation: Formation;
    questions: Question[];
    created_at: Date;
    updated_at: Date;
}
