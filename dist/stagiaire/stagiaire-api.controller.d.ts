import { InscriptionService } from "../inscription/inscription.service";
import { RankingService } from "../ranking/ranking.service";
import { StagiaireService } from "./stagiaire.service";
import { ApiResponseService } from "../common/services/api-response.service";
import { S3StorageService } from "../common/services/s3-storage.service";
export declare class StagiaireApiController {
    private inscriptionService;
    private rankingService;
    private stagiaireService;
    private apiResponse;
    private s3Storage;
    constructor(inscriptionService: InscriptionService, rankingService: RankingService, stagiaireService: StagiaireService, apiResponse: ApiResponseService, s3Storage: S3StorageService);
    profile(req: any): Promise<any>;
    updateProfile(req: any, data: any): Promise<any>;
    patchProfile(req: any, data: any): Promise<any>;
    uploadProfilePhoto(req: any, data: any): Promise<any>;
    show(req: any): Promise<any>;
    dashboardHome(req: any): Promise<any>;
    formations(req: any): Promise<any>;
    formationClassement(formationId: number): Promise<any>;
    inscriptionCatalogueFormation(req: any, data: any): Promise<{
        success: boolean;
        message: string;
        demande: import("../entities/demande-inscription.entity").DemandeInscription;
    }>;
    onboardingSeen(req: any): Promise<any>;
    achievements(req: any): Promise<any>;
    allAchievements(): Promise<any>;
    checkAchievements(): Promise<any>;
    contacts(): Promise<any>;
    contactsCommerciaux(): Promise<any>;
    contactsFormateurs(): Promise<any>;
    contactsPoleRelation(): Promise<any>;
    contactsPoleSave(): Promise<any>;
    progress(req: any): Promise<any>;
    quizzes(req: any): Promise<{
        data: {
            id: string;
            titre: string;
            description: string;
            duree: string;
            niveau: string;
            status: string;
            nb_points_total: string;
            formationId: string;
            categorie: string;
            formation: {
                id: number;
                titre: string;
                categorie: string;
            };
            questions: {
                id: string;
                text: string;
                type: string;
                points: number;
                answers: {
                    id: string;
                    text: string;
                    isCorrect: boolean;
                }[];
            }[];
            userParticipation: {
                id: number;
                status: string;
                score: number;
                correct_answers: number;
                time_spent: number;
                started_at: string;
                completed_at: string;
            };
        }[];
    }>;
    rankingGlobal(period?: string): Promise<any>;
    rankingFormation(formationId: number): Promise<any>;
    rewards(req: any): Promise<any>;
    partner(): Promise<any>;
    parainageStats(): Promise<any>;
    parainageHistory(): Promise<any>;
    parainageFilleuls(): Promise<any>;
    parainageRewards(): Promise<any>;
    parainageAccept(data: any): Promise<any>;
    userFormations(id: number): Promise<any>;
    userCatalogueFormations(id: number): Promise<any[]>;
}
export declare class ApiGeneralController {
    private rankingService;
    private stagiaireService;
    private apiResponse;
    constructor(rankingService: RankingService, stagiaireService: StagiaireService, apiResponse: ApiResponseService);
    getUserSettings(req: any): Promise<any>;
    updateUserSettings(req: any, data: any): Promise<any>;
    reportUserAppUsage(req: any, data: any): Promise<any>;
    updateUserPhoto(req: any, data: any): Promise<any>;
    getUserPoints(req: any): Promise<any>;
    updateAvatar(id: string, file: Express.Multer.File, req: any): Promise<any>;
    getUserStatus(): Promise<{
        online_users: import("../entities/user.entity").User[];
        recently_online: import("../entities/user.entity").User[];
        all_users: import("../entities/user.entity").User[];
    }>;
    updateFcmToken(req: any, token: string): Promise<any>;
}
