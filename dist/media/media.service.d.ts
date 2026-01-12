import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
export declare class MediaService {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    findAll(): Promise<Media[]>;
    findByType(type: string): Promise<Media[]>;
    findByCategoriePaginated(categorie: string, page?: number, perPage?: number, baseUrl?: string, userId?: number): Promise<{
        current_page: number;
        data: {
            id: number;
            titre: string;
            description: string;
            url: string;
            size: number;
            mime: string;
            uploaded_by: number;
            video_platform: string;
            video_file_path: string;
            subtitle_file_path: string;
            subtitle_language: string;
            type: string;
            categorie: string;
            duree: string;
            ordre: number;
            formation_id: number;
            created_at: string;
            updated_at: string;
            video_url: string;
            subtitle_url: string;
            stagiaires: {
                id: number;
                is_watched: number;
                watched_at: any;
                pivot: {
                    media_id: number;
                    stagiaire_id: number;
                    is_watched: number;
                    watched_at: any;
                    created_at: any;
                    updated_at: any;
                };
            }[];
        }[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }>;
    private generateLinks;
    findByFormationAndCategorie(formationId: number, categorie: string, page?: number, perPage?: number, baseUrl?: string, userId?: number): Promise<{
        current_page: number;
        data: {
            id: number;
            titre: string;
            description: string;
            url: string;
            size: number;
            mime: string;
            uploaded_by: number;
            video_platform: string;
            video_file_path: string;
            subtitle_file_path: string;
            subtitle_language: string;
            type: string;
            categorie: string;
            duree: string;
            ordre: number;
            formation_id: number;
            created_at: string;
            updated_at: string;
            video_url: string;
            subtitle_url: string;
            stagiaires: {
                id: number;
                is_watched: number;
                watched_at: any;
                pivot: {
                    media_id: number;
                    stagiaire_id: number;
                    is_watched: number;
                    watched_at: any;
                    created_at: any;
                    updated_at: any;
                };
            }[];
        }[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }>;
    private formatMedia;
}
