export declare class FormateurWebController {
    constructor();
    dashboard(req: any): Promise<{
        message: string;
        user: any;
    }>;
    catalogue(): Promise<{
        message: string;
    }>;
    classement(): Promise<{
        message: string;
    }>;
    formations(): Promise<{
        data: any[];
        message: string;
    }>;
    showFormation(): Promise<{
        message: string;
    }>;
    profile(req: any): Promise<{
        message: string;
        user: any;
    }>;
    updateProfile(req: any, data: any): Promise<{
        message: string;
        user: any;
    }>;
    stagiaires(): Promise<{
        data: any[];
        message: string;
    }>;
    stagiaireEnCours(): Promise<{
        data: any[];
        message: string;
    }>;
    stagiaireTermines(): Promise<{
        data: any[];
        message: string;
    }>;
    stagiaireApplication(): Promise<{
        data: any[];
        message: string;
    }>;
    showStagiaire(): Promise<{
        message: string;
    }>;
    stagiaireClassement(): Promise<{
        message: string;
    }>;
    stats(): Promise<{
        data: {};
        message: string;
    }>;
    statsExport(): Promise<{
        message: string;
    }>;
    statsExportXlsx(): Promise<{
        message: string;
    }>;
    affluence(): Promise<{
        data: {};
        message: string;
    }>;
    statsClassement(): Promise<{
        data: {};
        message: string;
    }>;
    statsParFormation(): Promise<{
        data: {};
        message: string;
    }>;
}
export declare class CommercialWebController {
    constructor();
    dashboard(req: any): Promise<{
        message: string;
        user: any;
    }>;
    affluence(): Promise<{
        data: {};
        message: string;
    }>;
    classement(): Promise<{
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
}
