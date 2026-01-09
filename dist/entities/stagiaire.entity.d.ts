import { User } from "./user.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class Stagiaire {
    id: number;
    civilite: string;
    prenom: string;
    telephone: string;
    adresse: string;
    date_naissance: Date;
    ville: string;
    code_postal: string;
    date_debut_formation: Date;
    date_inscription: Date;
    role: string;
    statut: string;
    user_id: number;
    date_fin_formation: Date;
    onboarding_seen: boolean;
    partenaire_id: number;
    user: User;
    catalogue_formations: CatalogueFormation[];
    created_at: Date;
    updated_at: Date;
}
