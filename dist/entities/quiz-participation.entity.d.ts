import { User } from "./user.entity";
import { Quiz } from "./quiz.entity";
import { QuizParticipationAnswer } from "./quiz-participation-answer.entity";
export declare class QuizParticipation {
    id: number;
    user_id: number;
    user: User;
    quiz_id: number;
    quiz: Quiz;
    status: string;
    started_at: Date;
    completed_at: Date;
    score: number;
    correct_answers: number;
    time_spent: number;
    current_question_id: number;
    answers: QuizParticipationAnswer[];
    created_at: Date;
    updated_at: Date;
}
