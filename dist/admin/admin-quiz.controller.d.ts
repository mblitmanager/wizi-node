import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
export declare class AdminQuizController {
    private quizRepository;
    constructor(quizRepository: Repository<Quiz>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Quiz[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Quiz>;
    create(data: any): Promise<Quiz[]>;
    update(id: number, data: any): Promise<Quiz>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    duplicate(id: number): Promise<Quiz[]>;
    enable(id: number): Promise<Quiz>;
    disable(id: number): Promise<Quiz>;
}
