import { Response } from "express";
export declare class AdminStatsController {
    constructor();
    affluence(): Promise<{
        data: {};
        message: string;
    }>;
    classement(): Promise<{
        data: {};
        message: string;
    }>;
    parCatalogue(): Promise<{
        data: {};
        message: string;
    }>;
    parFormateur(): Promise<{
        data: {};
        message: string;
    }>;
    parFormation(): Promise<{
        data: {};
        message: string;
    }>;
    stagiaires(page?: number, limit?: number): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    stagiaireExport(res: Response): Promise<void>;
    stagiaireExportXlsx(res: Response): Promise<void>;
}
export declare class AdminImportController {
    constructor();
    importStagiaires(data: any): Promise<{
        message: string;
        data: any;
    }>;
    importQuiz(data: any): Promise<{
        message: string;
        data: any;
    }>;
    importFormateur(data: any): Promise<{
        message: string;
        data: any;
    }>;
    importCommercials(data: any): Promise<{
        message: string;
        data: any;
    }>;
    importPrc(data: any): Promise<{
        message: string;
        data: any;
    }>;
    status(): Promise<{
        status: string;
    }>;
    reports(): Promise<{
        data: any[];
        message: string;
    }>;
    getReport(): Promise<{
        message: string;
    }>;
    purgeReports(): Promise<{
        message: string;
    }>;
    newQuizQuestion(data: any): Promise<{
        message: string;
        data: any;
    }>;
    questionImport(data: any): Promise<{
        message: string;
        data: any;
    }>;
}
export declare class AdminInactivityController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
    notify(): Promise<{
        message: string;
    }>;
    userAppUsages(page?: number, limit?: number): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    userAppUsagesExport(): Promise<{
        message: string;
    }>;
    downloadCommercialModel(res: Response): Promise<void>;
    downloadFormateurModel(res: Response): Promise<void>;
    downloadPrcModel(res: Response): Promise<void>;
    downloadStagiaireModel(res: Response): Promise<void>;
    downloadQuizModel(res: Response): Promise<void>;
    manual(): Promise<{
        message: string;
    }>;
}
