import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
export declare class QuestionsApiController {
    private apiResponse;
    private questionRepository;
    private reponseRepository;
    constructor(apiResponse: ApiResponseService, questionRepository: Repository<Question>, reponseRepository: Repository<Reponse>);
    getAll(page?: number, limit?: number): Promise<any>;
    create(createQuestionDto: any): Promise<any>;
    getById(id: number): Promise<any>;
    update(id: number, updateQuestionDto: any): Promise<any>;
    delete(id: number): Promise<any>;
    getReponsesByQuestion(questionId: number): Promise<any>;
    private formatQuestion;
    private formatReponse;
}
