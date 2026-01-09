import { User } from "./user.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class DemandeInscription {
    id: number;
    parrain_id: number;
    filleul_id: number;
    formation_id: number;
    statut: string;
    donnees_formulaire: string;
    lien_parrainage: string;
    motif: string;
    date_demande: Date;
    date_inscription: Date;
    parrain: User;
    filleul: User;
    formation: CatalogueFormation;
    created_at: Date;
    updated_at: Date;
}
