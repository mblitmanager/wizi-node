import { ApiResponseService } from "../common/services/api-response.service";
import { AdminService } from "./admin.service";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
export declare class FormateurApiController {
    private apiResponse;
    private adminService;
    private formateurRepository;
    private quizParticipationRepository;
    constructor(apiResponse: ApiResponseService, adminService: AdminService, formateurRepository: Repository<Formateur>, quizParticipationRepository: Repository<QuizParticipation>);
    dashboardHome(req: any, days?: number): Promise<any>;
    dashboardStats(req: any): Promise<any>;
    formations(req: any): Promise<any>;
    stagiaires(req: any): Promise<any>;
    onlineStagiaires(req: any): Promise<any>;
    inactiveStagiaires(req: any, days?: number, scope?: string): Promise<any>;
    neverConnected(): Promise<any>;
    performance(req: any): Promise<any>;
    disconnect(data: {
        stagiaire_ids: number[];
    }): Promise<any>;
    stagiaireProfile(id: number): Promise<any>;
    stagiaireStats(id: number): Promise<any>;
    videoStats(id: number): Promise<any>;
    videos(): Promise<any>;
    formationRanking(formationId: number): Promise<any>;
    arenaRanking(period?: string, formationId?: number): Promise<any>;
    mesStagiairesRanking(req: any, period?: string): Promise<any>;
    sendEmail(data: any): Promise<any>;
    sendNotification(req: any, data: any): Promise<any>;
    trends(req: any): Promise<any>;
    getFormationsPerformance(req: any): Promise<any>;
    getStagiaireFormations(id: number): Promise<any>;
    getQuizSuccessRate(period: number, formationId: number, req: any): Promise<any>;
    getCompletionTime(period: number, req: any): Promise<any>;
    getActivityHeatmap(period: number, formationId: number, req: any): Promise<any>;
    getDropoutRate(formationId: number, req: any): Promise<any>;
    getDashboard(period: number, formationId: number, req: any): Promise<any>;
    getFormationsOverview(req: any): Promise<any>;
    getStudentsComparison(formationId: number, req: any): Promise<any>;
    getStudentPerformance(req: any): Promise<any>;
    stats(): Promise<any>;
}
export declare class CommercialApiController {
    private apiResponse;
    private adminService;
    constructor(apiResponse: ApiResponseService, adminService: AdminService);
    dashboard(req: any): Promise<any>;
}
