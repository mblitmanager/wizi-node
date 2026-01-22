import { Media } from "./media.entity";
import { Stagiaire } from "./stagiaire.entity";
export declare class MediaStagiaire {
    media_id: number;
    stagiaire_id: number;
    is_watched: boolean;
    watched_at: Date;
    created_at: Date;
    current_time: number;
    duration: number;
    percentage: number;
    updated_at: Date;
    media: Media;
    stagiaire: Stagiaire;
}
