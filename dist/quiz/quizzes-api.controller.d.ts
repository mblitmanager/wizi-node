import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
import { Quiz } from "../entities/quiz.entity";
export declare class QuizzesApiController {
    private quizService;
    private apiResponse;
    private quizRepository;
    constructor(quizService: QuizService, apiResponse: ApiResponseService, quizRepository: Repository<Quiz>);
    getAll(page?: number, limit?: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        member: {
            "@context": string;
            "@id": string;
            "@type": string;
            id: number;
            titre: string;
            description: string;
            duree: string;
            formation: string;
            nbPointsTotal: string;
            niveau: string;
            questions: string[];
            participations: any[];
            status: string;
            created_at: string;
            updated_at: string;
        }[];
        totalItems: number;
    }>;
    create(createQuizDto: any): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        created_at: string;
        updated_at: string;
    }>;
    getById(id: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        created_at: string;
        updated_at: string;
    }>;
    update(id: number, updateQuizDto: any): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        created_at: string;
        updated_at: string;
    }>;
    delete(id: number): Promise<{
        id: number;
        message: string;
    }>;
    submit(quizId: number, data: any, req: any): Promise<{
        quiz_id: number;
        score: number;
        message: string;
    }>;
}
