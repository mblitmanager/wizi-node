import { Question } from "./question.entity";
export declare class Reponse {
    id: number;
    text: string;
    isCorrect: boolean;
    position: number;
    match_pair: string;
    bank_group: string;
    flashcardBack: string;
    question_id: number;
    question: Question;
    created_at: Date;
    updated_at: Date;
}
