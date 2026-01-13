import { Quiz } from "./quiz.entity";
import { Reponse } from "./reponse.entity";
export declare class Question {
    id: number;
    text: string;
    type: string;
    explication: string;
    points: string;
    astuce: string;
    media_url: string;
    quiz_id: number;
    quiz: Quiz;
    reponses: Reponse[];
    created_at: Date;
    updated_at: Date;
}
