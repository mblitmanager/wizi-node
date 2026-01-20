import { Media } from "./media.entity";
import { Quiz } from "./quiz.entity";
import { Progression } from "./progression.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";
export declare class Formation {
    id: number;
    titre: string;
    slug: string;
    description: string;
    categorie: string;
    icon: string;
    image: string;
    statut: number;
    duree: string;
    created_at: Date;
    updated_at: Date;
    medias: Media[];
    quizzes: Quiz[];
    progressions: Progression[];
    catalogue_formations: CatalogueFormation[];
}
