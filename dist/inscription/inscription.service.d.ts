import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { NotificationService } from "../notification/notification.service";
export declare class InscriptionService {
    private demandeRepository;
    private stagiaireRepository;
    private catalogueRepository;
    private notificationService;
    constructor(demandeRepository: Repository<DemandeInscription>, stagiaireRepository: Repository<Stagiaire>, catalogueRepository: Repository<CatalogueFormation>, notificationService: NotificationService);
    inscrire(userId: number, catalogueFormationId: number): Promise<{
        success: boolean;
        message: string;
        demande: DemandeInscription[];
    }>;
}
