import { User } from "./user.entity";
export declare class PoleRelationClient {
    id: number;
    role: string;
    stagiaire_id: number;
    user_id: number;
    user: User;
    prenom: string;
    telephone: string;
    created_at: Date;
    updated_at: Date;
}
