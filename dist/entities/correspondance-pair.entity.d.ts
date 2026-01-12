import { Question } from "./question.entity";
export declare class CorrespondancePair {
    id: number;
    question_id: number;
    left_text: string;
    right_text: string;
    left_id: number;
    right_id: number;
    created_at: Date;
    updated_at: Date;
    question: Question;
}
