import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminQuizController {
    private quizRepository;
    private apiResponse;
    constructor(quizRepository: Repository<Quiz>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Quiz>>;
    findOne(id: number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
    duplicate(id: number): Promise<any>;
    enable(id: number): Promise<any>;
    disable(id: number): Promise<any>;
}
