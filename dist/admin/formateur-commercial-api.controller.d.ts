export declare class FormateurApiController {
    constructor();
    dashboardStats(req: any): Promise<{
        data: {};
        message: string;
    }>;
    formations(req: any): Promise<{
        data: any[];
        message: string;
    }>;
    stagiaires(req: any): Promise<{
        data: any[];
        message: string;
    }>;
    onlineStagiaires(): Promise<{
        data: any[];
        message: string;
    }>;
    inactiveStagiaires(): Promise<{
        data: any[];
        message: string;
    }>;
    neverConnected(): Promise<{
        data: any[];
        message: string;
    }>;
    performance(): Promise<{
        data: any[];
        message: string;
    }>;
    disconnect(data: any): Promise<{
        message: string;
    }>;
    stagiaireStats(id: number): Promise<{
        data: {};
        message: string;
    }>;
    videoStats(id: number): Promise<{
        data: {};
        message: string;
    }>;
    videos(): Promise<{
        data: any[];
        message: string;
    }>;
    formationRanking(formationId: number): Promise<{
        data: any[];
        message: string;
    }>;
    mesStagiairesRanking(): Promise<{
        data: any[];
        message: string;
    }>;
    sendEmail(data: any): Promise<{
        message: string;
    }>;
    sendNotification(data: any): Promise<{
        message: string;
    }>;
    stats(): Promise<{
        data: {};
        message: string;
    }>;
}
export declare class CommercialApiController {
    constructor();
    dashboard(req: any): Promise<{
        data: {};
        message: string;
    }>;
}
