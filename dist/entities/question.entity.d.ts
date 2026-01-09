import { Quiz } from "./quiz.entity";
import { Reponse } from "./reponse.entity";
export declare class Question {
    id: number;
    question_text: string;
    quiz_id: number;
    quiz: Quiz;
    reponses: Reponse[];
    created_at: Date;
    updated_at: Date;
}
