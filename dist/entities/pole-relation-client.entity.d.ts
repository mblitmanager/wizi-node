import { User } from "./user.entity";
import { Stagiaire } from "./stagiaire.entity";
export declare class PoleRelationClient {
    id: number;
    role: string;
    user_id: number;
    user: User;
    stagiaires: Stagiaire[];
    prenom: string;
    telephone: string;
    created_at: Date;
    updated_at: Date;
}
