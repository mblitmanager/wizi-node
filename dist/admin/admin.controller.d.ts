export declare class AdminController {
    dashboard(req: any): Promise<{
        message: string;
        user: any;
    }>;
    stagiaires(req: any): Promise<{
        page: string;
    }>;
    formations(req: any): Promise<{
        page: string;
    }>;
    quiz(req: any): Promise<{
        page: string;
    }>;
    catalogue(req: any): Promise<{
        page: string;
    }>;
    formateurs(req: any): Promise<{
        page: string;
    }>;
    commerciaux(req: any): Promise<{
        page: string;
    }>;
    achievements(req: any): Promise<{
        page: string;
    }>;
    stats(req: any): Promise<{
        page: string;
    }>;
    parametres(req: any): Promise<{
        page: string;
    }>;
}
