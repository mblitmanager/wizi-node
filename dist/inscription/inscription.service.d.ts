import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { NotificationService } from "../notification/notification.service";
import { MailService } from "../mail/mail.service";
export declare class InscriptionService {
    private demandeRepository;
    private stagiaireRepository;
    private catalogueRepository;
    private scfRepository;
    private notificationService;
    private mailService;
    constructor(demandeRepository: Repository<DemandeInscription>, stagiaireRepository: Repository<Stagiaire>, catalogueRepository: Repository<CatalogueFormation>, scfRepository: Repository<StagiaireCatalogueFormation>, notificationService: NotificationService, mailService: MailService);
    inscrire(userId: number, catalogueFormationId: number): Promise<{
        success: boolean;
        message: string;
        demande: DemandeInscription;
    }>;
}
