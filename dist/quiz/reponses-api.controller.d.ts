import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { Reponse } from "../entities/reponse.entity";
import { Question } from "../entities/question.entity";
export declare class ReponseApiController {
    private apiResponse;
    private reponseRepository;
    private questionRepository;
    constructor(apiResponse: ApiResponseService, reponseRepository: Repository<Reponse>, questionRepository: Repository<Question>);
    getAll(page?: number, limit?: number): Promise<any>;
    create(createReponseDto: any): Promise<any>;
    getById(id: number): Promise<any>;
    update(id: number, updateReponseDto: any): Promise<any>;
    delete(id: number): Promise<any>;
    private formatReponse;
}
