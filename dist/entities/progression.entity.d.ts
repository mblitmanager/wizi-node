import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";
import { Formation } from "./formation.entity";
export declare class Progression {
    id: number;
    termine: boolean;
    stagiaire_id: number;
    stagiaire: Stagiaire;
    quiz_id: number;
    quiz: Quiz;
    formation_id: number;
    formation: Formation;
    pourcentage: number;
    explication: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_spent: number;
    completion_time: Date;
    created_at: Date;
    updated_at: Date;
}
