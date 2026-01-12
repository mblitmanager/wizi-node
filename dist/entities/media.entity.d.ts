import { Formation } from "./formation.entity";
import { Stagiaire } from "./stagiaire.entity";
import { MediaStagiaire } from "./media-stagiaire.entity";
export declare class Media {
    id: number;
    url: string;
    type: string;
    categorie: string;
    titre: string;
    description: string;
    formation_id: number;
    formation: Formation;
    duree: string;
    ordre: number;
    video_platform: string;
    video_file_path: string;
    subtitle_file_path: string;
    subtitle_language: string;
    size: number;
    mime: string;
    uploaded_by: number;
    stagiaires: Stagiaire[];
    mediaStagiaires: MediaStagiaire[];
    created_at: Date;
    updated_at: Date;
    video_url?: string;
    subtitle_url?: string;
    computeUrls(): void;
}
