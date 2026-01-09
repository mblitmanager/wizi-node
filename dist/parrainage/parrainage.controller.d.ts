import { ParrainageService } from "./parrainage.service";
export declare class ParrainageController {
    private readonly parrainageService;
    constructor(parrainageService: ParrainageService);
    generateLink(req: any): Promise<{
        success: boolean;
        token: string;
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        message: string;
        parrain?: undefined;
    } | {
        success: boolean;
        parrain: any;
        message?: undefined;
    }>;
    getStatsParrain(req: any): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
}
