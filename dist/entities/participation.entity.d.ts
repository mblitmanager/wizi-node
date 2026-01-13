import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";
export declare class Participation {
    id: number;
    stagiaire_id: number;
    stagiaire: Stagiaire;
    quiz_id: number;
    quiz: Quiz;
    date: string;
    heure: string;
    score: number;
    deja_jouer: boolean;
    current_question_id: number;
    created_at: Date;
    updated_at: Date;
}
