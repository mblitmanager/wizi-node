import { MediaService } from "./media.service";
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(): Promise<import("../entities/media.entity").Media[]>;
    getTutoriels(page: string, req: any): Promise<{
        current_page: number;
        data: import("../entities/media.entity").Media[];
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
    getAstuces(page: string, req: any): Promise<{
        current_page: number;
        data: import("../entities/media.entity").Media[];
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
    getTutorielsByFormation(formationId: number, req: any): Promise<{
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
    getAstucesByFormation(formationId: number, req: any): Promise<{
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
