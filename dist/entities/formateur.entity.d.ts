import { User } from "./user.entity";
export declare class Formateur {
    id: number;
    user_id: number;
    user: User;
    prenom: string;
    telephone: string;
    stagiaires: any[];
    formations: any[];
    created_at: Date;
    updated_at: Date;
}
