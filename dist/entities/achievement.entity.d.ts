import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";
export declare class Achievement {
    id: number;
    name: string;
    type: string;
    condition: string;
    description: string;
    icon: string;
    level: string;
    quiz_id: number;
    quiz: Quiz;
    code: string;
    stagiaires: Stagiaire[];
    created_at: Date;
    updated_at: Date;
}
