import { InscriptionService } from "../inscription/inscription.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class StagiaireApiController {
    private inscriptionService;
    private apiResponse;
    constructor(inscriptionService: InscriptionService, apiResponse: ApiResponseService);
    profile(req: any): Promise<any>;
    updateProfile(req: any, data: any): Promise<any>;
    patchProfile(req: any, data: any): Promise<any>;
    uploadProfilePhoto(req: any, data: any): Promise<any>;
    show(req: any): Promise<any>;
    dashboardHome(req: any): Promise<any>;
    formations(req: any): Promise<any>;
    formationClassement(): Promise<any>;
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
    progress(): Promise<any>;
    quizzes(): Promise<any>;
    rankingGlobal(): Promise<any>;
    rankingFormation(): Promise<any>;
    rewards(): Promise<any>;
    partner(): Promise<any>;
    parainageStats(): Promise<any>;
    parainageHistory(): Promise<any>;
    parainageFilleuls(): Promise<any>;
    parainageRewards(): Promise<any>;
    parainageAccept(data: any): Promise<any>;
    userFormations(id: number): Promise<any>;
    userCatalogueFormations(id: number): Promise<any>;
}
export declare class ApiGeneralController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    getUser(req: any): Promise<any>;
    getMe(req: any): Promise<any>;
    getUserSettings(req: any): Promise<any>;
    updateUserSettings(req: any, data: any): Promise<any>;
    reportUserAppUsage(req: any, data: any): Promise<any>;
    updateUserPhoto(req: any, data: any): Promise<any>;
    getUserPoints(req: any): Promise<any>;
    updateFcmToken(req: any, token: string): Promise<any>;
}
