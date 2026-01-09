import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
export declare class AdminQuizController {
    private quizRepository;
    constructor(quizRepository: Repository<Quiz>);
    findAll(page?: number, limit?: number): Promise<{
        data: Quiz[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    findOne(id: number): Promise<Quiz>;
    create(data: any): Promise<Quiz[]>;
    update(id: number, data: any): Promise<Quiz>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
