import { Stagiaire } from "./stagiaire.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class StagiaireCatalogueFormation {
    id: number;
    stagiaire_id: number;
    catalogue_formation_id: number;
    date_debut: Date;
    date_inscription: Date;
    date_fin: Date;
    formateur_id: number;
    stagiaire: Stagiaire;
    catalogue_formation: CatalogueFormation;
    created_at: Date;
    updated_at: Date;
}
