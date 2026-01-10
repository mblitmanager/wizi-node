import { InscriptionService } from "./inscription.service";
export declare class InscriptionController {
    private readonly inscriptionService;
    constructor(inscriptionService: InscriptionService);
    inscrire(req: any, catalogueFormationId: number): Promise<{
        success: boolean;
        message: string;
        demande: import("../entities/demande-inscription.entity").DemandeInscription;
    }>;
}
