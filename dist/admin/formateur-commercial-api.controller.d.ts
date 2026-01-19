import { ApiResponseService } from "../common/services/api-response.service";
import { AdminService } from "./admin.service";
export declare class FormateurApiController {
    private apiResponse;
    private adminService;
    constructor(apiResponse: ApiResponseService, adminService: AdminService);
    dashboardStats(req: any): Promise<any>;
    formations(req: any): Promise<any>;
    stagiaires(req: any): Promise<any>;
    onlineStagiaires(): Promise<any>;
    inactiveStagiaires(req: any, days?: number, scope?: string): Promise<any>;
    neverConnected(): Promise<any>;
    performance(req: any): Promise<any>;
    disconnect(data: {
        stagiaire_ids: number[];
    }): Promise<any>;
    stagiaireStats(id: number): Promise<any>;
    videoStats(id: number): Promise<any>;
    videos(): Promise<any>;
    formationRanking(formationId: number): Promise<any>;
    mesStagiairesRanking(req: any, period?: string): Promise<any>;
    sendEmail(data: any): Promise<any>;
    sendNotification(req: any, data: any): Promise<any>;
    trends(req: any): Promise<any>;
    stats(): Promise<any>;
}
export declare class CommercialApiController {
    private apiResponse;
    private adminService;
    constructor(apiResponse: ApiResponseService, adminService: AdminService);
    dashboard(req: any): Promise<any>;
}
