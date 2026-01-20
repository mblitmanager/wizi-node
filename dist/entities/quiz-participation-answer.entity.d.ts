import { QuizParticipation } from "./quiz-participation.entity";
import { Question } from "./question.entity";
export declare class QuizParticipationAnswer {
    id: number;
    participation_id: number;
    participation: QuizParticipation;
    question_id: number;
    question: Question;
    answer_ids: any;
    created_at: Date;
    updated_at: Date;
}
