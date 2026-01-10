import { ParrainageService } from "./parrainage.service";
export declare class ParrainageController {
    private parrainageService;
    constructor(parrainageService: ParrainageService);
    getEvents(): Promise<{
        success: boolean;
        data: import("../entities/parrainage-event.entity").ParrainageEvent[];
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        parrain: any;
    }>;
    registerFilleul(data: any): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            };
            stagiaire: {
                id: number;
            };
        };
    }>;
    generateLink(req: any): Promise<{
        success: boolean;
        token: string;
    }>;
    getStatsParrain(req: any): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getStatsParrainById(parrainId: number): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getFilleuls(req: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            date: Date;
            points: number;
            status: string;
        }[];
    }>;
    getRewards(req: any): Promise<{
        success: boolean;
        total_points: number;
        total_filleuls: number;
        gains: number;
        rewards: {
            id: number;
            points: number;
            date: Date;
        }[];
    }>;
    getHistory(req: any): Promise<{
        success: boolean;
        parrainages: {
            id: number;
            parrain_id: number;
            filleul_id: number;
            points: number;
            gains: number;
            created_at: Date;
            filleul: {
                id: number;
                name: string;
                statut: string;
            };
        }[];
        tokens: {
            id: number;
            token: string;
            created_at: Date;
            expires_at: Date;
        }[];
    }>;
}
