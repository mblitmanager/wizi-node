import { Question } from "./question.entity";
export declare class Reponse {
    id: number;
    reponse_text: string;
    is_correct: boolean;
    question_id: number;
    question: Question;
    created_at: Date;
    updated_at: Date;
}
