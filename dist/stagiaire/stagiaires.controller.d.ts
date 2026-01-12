import { StagiaireService } from "./stagiaire.service";
export declare class StagiairesController {
    private stagiaireService;
    constructor(stagiaireService: StagiaireService);
    getStagiaireDetails(id: number): Promise<{
        id: number;
        firstname: string;
        lastname: string;
        name: string;
        avatar: string;
        rang: number;
        totalPoints: number;
        formations: {
            id: number;
            titre: string;
        }[];
        formateurs: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        }[];
        quizStats: {
            totalCompleted: number;
            totalQuiz: number;
            pourcentageReussite: number;
            byLevel: {
                debutant: {
                    completed: number;
                    total: number;
                };
                intermediaire: {
                    completed: number;
                    total: number;
                };
                expert: {
                    completed: number;
                    total: number;
                };
            };
            lastActivity: Date;
        };
    }>;
}
