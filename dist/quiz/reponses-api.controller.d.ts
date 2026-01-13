import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
import { Reponse } from "../entities/reponse.entity";
import { Question } from "../entities/question.entity";
export declare class ReponseApiController {
    private quizService;
    private apiResponse;
    private reponseRepository;
    private questionRepository;
    constructor(quizService: QuizService, apiResponse: ApiResponseService, reponseRepository: Repository<Reponse>, questionRepository: Repository<Question>);
    getAll(page?: number, limit?: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        member: {
            "@id": string;
            "@type": string;
            id: number;
            text: string;
            isCorrect: boolean;
            position: number;
            flashcardBack: string;
            match_pair: string;
            bank_group: string;
            question: string;
            createdAt: string;
            updatedAt: string;
        }[];
        totalItems: number;
    }>;
    create(createReponseDto: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        isCorrect: boolean;
        position: number;
        flashcardBack: string;
        match_pair: string;
        bank_group: string;
        question: string;
        createdAt: string;
        updatedAt: string;
    }>;
    getById(id: number): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        isCorrect: boolean;
        position: number;
        flashcardBack: string;
        match_pair: string;
        bank_group: string;
        question: string;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: number, updateReponseDto: any): Promise<{
        "@id": string;
        "@type": string;
        id: number;
        text: string;
        isCorrect: boolean;
        position: number;
        flashcardBack: string;
        match_pair: string;
        bank_group: string;
        question: string;
        createdAt: string;
        updatedAt: string;
    }>;
    delete(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
