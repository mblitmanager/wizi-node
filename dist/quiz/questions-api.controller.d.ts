import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
export declare class QuestionsApiController {
    private quizService;
    private apiResponse;
    private questionRepository;
    private reponseRepository;
    constructor(quizService: QuizService, apiResponse: ApiResponseService, questionRepository: Repository<Question>, reponseRepository: Repository<Reponse>);
    getAll(page?: number, limit?: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        totalItems: number;
        member: {
            "@id": string;
            "@type": string;
            id: number;
            text: string;
            type: string;
            explication: string;
            points: string;
            astuce: string;
            createdAt: string;
            updatedAt: string;
            quiz: string;
            reponses: string[];
        }[];
    }>;
    create(createQuestionDto: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        type: string;
        explication: string;
        points: string;
        astuce: string;
        createdAt: string;
        updatedAt: string;
        quiz: string;
        reponses: string[];
    }>;
    getById(id: number): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        type: string;
        explication: string;
        points: string;
        astuce: string;
        createdAt: string;
        updatedAt: string;
        quiz: string;
        reponses: string[];
    }>;
    update(id: number, updateQuestionDto: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        type: string;
        explication: string;
        points: string;
        astuce: string;
        createdAt: string;
        updatedAt: string;
        quiz: string;
        reponses: string[];
    }>;
    delete(id: number): Promise<{
        id: number;
        message: string;
    }>;
    getReponsesByQuestion(questionId: number): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        texte: string;
        correct: boolean;
        position: number;
        explanation: string;
        match_pair: string;
        bank_group: string;
        question: string;
        created_at: Date;
        updated_at: Date;
    }[]>;
}
