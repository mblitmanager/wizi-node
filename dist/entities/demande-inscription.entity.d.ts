import { User } from "./user.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class DemandeInscription {
    id: number;
    parrain_id: number;
    parrain: User;
    filleul_id: number;
    filleul: User;
    formation_id: number;
    formation: CatalogueFormation;
    statut: string;
    donnees_formulaire: any;
    lien_parrainage: string;
    motif: string;
    date_demande: Date;
    date_inscription: Date;
    created_at: Date;
    updated_at: Date;
}
