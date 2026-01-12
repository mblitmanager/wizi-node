import { FormationService } from "./formation.service";
export declare class FormationApiController {
    private formationService;
    constructor(formationService: FormationService);
    getCategories(): Promise<string[]>;
    listFormations(page: string, req: any): Promise<{
        data: {
            current_page: number;
            data: {
                id: number;
                titre: string;
                slug: string;
                description: string;
                statut: number;
                duree: string;
                categorie: string;
                image: string;
                icon: string;
                created_at: string;
                updated_at: string;
                catalogue_formation: {
                    id: number;
                    titre: string;
                    description: string;
                    prerequis: string;
                    image_url: string;
                    cursus_pdf: string;
                    tarif: string;
                    certification: string;
                    statut: number;
                    duree: string;
                    formation_id: number;
                    deleted_at: any;
                    created_at: string;
                    updated_at: string;
                    objectifs: string;
                    programme: string;
                    modalites: string;
                    modalites_accompagnement: string;
                    moyens_pedagogiques: string;
                    modalites_suivi: string;
                    evaluation: string;
                    lieu: string;
                    niveau: string;
                    public_cible: string;
                    nombre_participants: number;
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
        };
    }>;
}
