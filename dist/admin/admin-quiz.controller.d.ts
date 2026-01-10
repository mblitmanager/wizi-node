import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminQuizController {
    private quizRepository;
    private apiResponse;
    constructor(quizRepository: Repository<Quiz>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Quiz>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz>>;
    create(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    duplicate(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz>>;
    enable(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz>>;
    disable(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Quiz>>;
}
