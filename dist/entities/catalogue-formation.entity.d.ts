import { Stagiaire } from "./stagiaire.entity";
export declare class CatalogueFormation {
    id: number;
    nom: string;
    description: string;
    image: string;
    created_at: Date;
    updated_at: Date;
    stagiaires: Stagiaire[];
}
