import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
export declare class MediaService {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    findAll(): Promise<Media[]>;
    findByType(type: string): Promise<Media[]>;
    findByCategoriePaginated(categorie: string, page?: number, perPage?: number, baseUrl?: string, userId?: number): Promise<{
        current_page: number;
        data: Media[];
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
    findByFormationAndCategorie(formationId: number, categorie: string, userId?: number): Promise<{
        id: number;
        titre: string;
        description: string;
        url: string;
        video_url: string;
        categorie: string;
        formation_id: number;
        created_at: string;
        updated_at: string;
        stagiaires: import("../entities/stagiaire.entity").Stagiaire[];
    }[]>;
}
