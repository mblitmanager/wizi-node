import { Media } from "./media.entity";
import { Quiz } from "./quiz.entity";
import { Progression } from "./progression.entity";
export declare class Formation {
    id: number;
    nom: string;
    code: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    medias: Media[];
    quizzes: Quiz[];
    progressions: Progression[];
}
