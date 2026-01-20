import { Stagiaire } from "./stagiaire.entity";
export declare class Partenaire {
    id: number;
    identifiant: string;
    adresse: string;
    ville: string;
    departement: string;
    code_postal: string;
    type: string;
    logo: string;
    contacts: any;
    actif: boolean;
    created_at: Date;
    updated_at: Date;
    stagiaires: Stagiaire[];
}
