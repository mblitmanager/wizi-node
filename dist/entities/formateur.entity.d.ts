import { User } from "./user.entity";
import { Agenda } from "./agenda.entity";
export declare class Formateur {
    id: number;
    user_id: number;
    user: User;
    prenom: string;
    civilite: string;
    role: string;
    telephone: string;
    deleted_at: Date;
    stagiaires: any[];
    formations: any[];
    agendas: Agenda[];
    created_at: Date;
    updated_at: Date;
}
