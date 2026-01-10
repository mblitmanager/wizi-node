import { User } from "./user.entity";
import { Stagiaire } from "./stagiaire.entity";
export declare class PoleRelationClient {
    id: number;
    role: string;
    user_id: number;
    user: User;
    prenom: string;
    telephone: string;
    stagiaires: Stagiaire[];
    created_at: Date;
    updated_at: Date;
}
