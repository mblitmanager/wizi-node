import { ApiResponseService } from "../common/services/api-response.service";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";
export declare class FormateurQuizController {
    private quizRepository;
    private questionsRepository;
    private reponseRepository;
    private formationRepository;
    private apiResponse;
    constructor(quizRepository: Repository<Quiz>, questionsRepository: Repository<Questions>, reponseRepository: Repository<Reponse>, formationRepository: Repository<Formation>, apiResponse: ApiResponseService);
    index(query: any): Promise<any>;
    show(id: number): Promise<any>;
    store(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    addQuestion(id: number, data: any): Promise<any>;
    updateQuestion(quizId: number, questionId: number, data: any): Promise<any>;
    deleteQuestion(quizId: number, questionId: number): Promise<any>;
    publish(id: number): Promise<any>;
    getFormations(): Promise<any>;
}
