import { FormationService } from "./formation.service";
export declare class FormationController {
    private formationService;
    constructor(formationService: FormationService);
    getAllFormations(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllCatalogue(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllFormationsAlias(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getWithFormations(req: any): Promise<{
        data: {
            formation: {
                image_url: string;
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
                medias: import("../entities/media.entity").Media[];
                quizzes: import("../entities/quiz.entity").Quiz[];
                progressions: import("../entities/progression.entity").Progression[];
            };
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
            stagiaires: import("../entities/stagiaire.entity").Stagiaire[];
            formateurs: import("../entities/formateur.entity").Formateur[];
        }[];
        total: number;
        per_page: number;
    }>;
    getStagiaireFormations(req: any): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
