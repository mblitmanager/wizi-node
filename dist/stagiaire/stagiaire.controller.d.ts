import { StagiaireService } from "./stagiaire.service";
export declare class StagiaireController {
    private stagiaireService;
    constructor(stagiaireService: StagiaireService);
    getProfile(req: any): Promise<import("../entities/stagiaire.entity").Stagiaire>;
    getHomeData(req: any): Promise<{
        stagiaire: import("../entities/stagiaire.entity").Stagiaire;
        welcome_message: string;
    }>;
}
