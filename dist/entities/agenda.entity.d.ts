import { Stagiaire } from "./stagiaire.entity";
import { Formateur } from "./formateur.entity";
export declare class Agenda {
    id: number;
    titre: string;
    description: string;
    date_debut: Date;
    date_fin: Date;
    evenement: string;
    commentaire: string;
    stagiaire_id: number;
    formateur_id: number;
    created_at: Date;
    updated_at: Date;
    stagiaire: Stagiaire;
    formateur: Formateur;
}
