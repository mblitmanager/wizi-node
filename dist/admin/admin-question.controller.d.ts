import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";
export declare class AdminQuestionController {
    private questionRepository;
    constructor(questionRepository: Repository<Question>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Question[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Question>;
    create(data: any): Promise<Question[]>;
    update(id: number, data: any): Promise<Question>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
