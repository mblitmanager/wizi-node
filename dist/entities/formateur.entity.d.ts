import { User } from "./user.entity";
import { Stagiaire } from "./stagiaire.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class Formateur {
    id: number;
    user_id: number;
    user: User;
    prenom: string;
    telephone: string;
    is_active: boolean;
    stagiaires: Stagiaire[];
    formations: CatalogueFormation[];
    created_at: Date;
    updated_at: Date;
}
