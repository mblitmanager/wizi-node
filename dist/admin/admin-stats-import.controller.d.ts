import { Response } from "express";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminStatsController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    affluence(): Promise<any>;
    dashboard(): Promise<any>;
    dashboardApi(): Promise<any>;
    affluenceApi(): Promise<any>;
    classement(): Promise<any>;
    parCatalogue(): Promise<any>;
    parFormateur(): Promise<any>;
    parFormation(): Promise<any>;
    quizApi(): Promise<any>;
    formationApi(): Promise<any>;
    onlineUsersApi(): Promise<any>;
    stagiaires(page?: number, limit?: number): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    stagiaireExport(res: Response): Promise<void>;
    stagiaireExportXlsx(res: Response): Promise<void>;
    exportExcel(data: any): Promise<any>;
    exportPdf(data: any): Promise<any>;
}
export declare class AdminImportController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    importStagiaires(data: any): Promise<any>;
    importQuiz(data: any): Promise<any>;
    importFormateur(data: any): Promise<any>;
    importCommercials(data: any): Promise<any>;
    importPrc(data: any): Promise<any>;
    status(): Promise<any>;
    reports(): Promise<any>;
    getReport(): Promise<any>;
    purgeReports(): Promise<any>;
    newQuizQuestion(data: any): Promise<any>;
    questionImport(data: any): Promise<any>;
}
export declare class AdminInactivityController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
    notify(): Promise<any>;
    userAppUsages(page?: number, limit?: number): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    userAppUsagesExport(): Promise<any>;
    downloadCommercialModel(res: Response): Promise<void>;
    downloadFormateurModel(res: Response): Promise<void>;
    downloadPrcModel(res: Response): Promise<void>;
    downloadStagiaireModel(res: Response): Promise<void>;
    downloadQuizModel(res: Response): Promise<void>;
    manual(): Promise<any>;
}
