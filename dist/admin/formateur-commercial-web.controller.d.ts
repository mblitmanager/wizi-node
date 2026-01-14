import { ApiResponseService } from "../common/services/api-response.service";
export declare class FormateurWebController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    dashboard(req: any): Promise<any>;
    catalogue(): Promise<any>;
    classement(): Promise<any>;
    showFormation(): Promise<any>;
    profile(req: any): Promise<any>;
    updateProfile(req: any, data: any): Promise<any>;
    stagiaireEnCours(): Promise<any>;
    stagiaireTermines(): Promise<any>;
    stagiaireApplication(): Promise<any>;
    showStagiaire(): Promise<any>;
    stagiaireClassement(): Promise<any>;
    stats(): Promise<any>;
    statsExport(): Promise<any>;
    statsExportXlsx(): Promise<any>;
    affluence(): Promise<any>;
    statsClassement(): Promise<any>;
    statsParFormation(): Promise<any>;
}
export declare class CommercialWebController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    dashboard(req: any): Promise<any>;
    affluence(): Promise<any>;
    classement(): Promise<any>;
    parFormateur(): Promise<any>;
    parFormation(): Promise<any>;
}
