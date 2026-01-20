import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";
export declare class Classement {
    id: number;
    rang: number;
    stagiaire_id: number;
    stagiaire: Stagiaire;
    quiz_id: number;
    quiz: Quiz;
    points: number;
    created_at: Date;
    updated_at: Date;
}
