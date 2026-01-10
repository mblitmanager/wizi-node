import { ApiResponseService } from "../common/services/api-response.service";
export declare class FormateurApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    dashboardStats(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    formations(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    stagiaires(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    onlineStagiaires(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    inactiveStagiaires(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    neverConnected(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    performance(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    disconnect(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    stagiaireStats(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    videoStats(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    videos(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    formationRanking(formationId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    mesStagiairesRanking(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    sendEmail(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    sendNotification(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    stats(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
}
export declare class CommercialApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    dashboard(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
}
