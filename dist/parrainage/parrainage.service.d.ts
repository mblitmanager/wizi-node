import { Repository, DataSource } from "typeorm";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { MailService } from "../mail/mail.service";
export declare class ParrainageService {
    private parrainageRepository;
    private parrainageTokenRepository;
    private parrainageEventRepository;
    private userRepository;
    private stagiaireRepository;
    private demandeInscriptionRepository;
    private catalogueFormationRepository;
    private dataSource;
    private mailService;
    constructor(parrainageRepository: Repository<Parrainage>, parrainageTokenRepository: Repository<ParrainageToken>, parrainageEventRepository: Repository<ParrainageEvent>, userRepository: Repository<User>, stagiaireRepository: Repository<Stagiaire>, demandeInscriptionRepository: Repository<DemandeInscription>, catalogueFormationRepository: Repository<CatalogueFormation>, dataSource: DataSource, mailService: MailService);
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
    generateLink(userId: number): Promise<{
        success: boolean;
        token: string;
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        parrain: any;
    }>;
    getStatsParrain(userId: number): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getEvents(): Promise<{
        success: boolean;
        data: ParrainageEvent[];
    }>;
    getFilleuls(parrainId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            date: Date;
            points: number;
            status: string;
        }[];
    }>;
    getRewards(parrainId: number): Promise<{
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
    getHistory(parrainId: number): Promise<{
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
