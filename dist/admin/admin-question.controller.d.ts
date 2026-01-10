import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminQuestionController {
    private questionRepository;
    private apiResponse;
    constructor(questionRepository: Repository<Question>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Question>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Question>>;
    create(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Question[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Question>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
