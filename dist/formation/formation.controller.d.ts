import { FormationService } from "./formation.service";
export declare class FormationController {
    private formationService;
    constructor(formationService: FormationService);
    getAllFormations(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllCatalogue(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllFormationsAlias(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getWithFormations(req: any): Promise<{
        data: {
            formation: any;
            id: number;
            titre: string;
            description: string;
            statut: number;
            certification: string;
            prerequis: string;
            duree: string;
            image_url: string;
            tarif: number;
            formation_id: number;
            cursus_pdf: string;
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
            created_at: Date;
            updated_at: Date;
            stagiaire_catalogue_formations: import("../entities/stagiaire-catalogue-formation.entity").StagiaireCatalogueFormation[];
            formateurs: any[];
        }[];
        total: number;
        per_page: number;
    }>;
    getStagiaireFormations(req: any): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
