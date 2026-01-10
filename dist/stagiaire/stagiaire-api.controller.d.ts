import { InscriptionService } from "../inscription/inscription.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class StagiaireApiController {
    private inscriptionService;
    private apiResponse;
    constructor(inscriptionService: InscriptionService, apiResponse: ApiResponseService);
    profile(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    updateProfile(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    patchProfile(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    uploadProfilePhoto(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    show(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    dashboardHome(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    formations(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    formationClassement(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    inscriptionCatalogueFormation(req: any, data: any): Promise<{
        success: boolean;
        message: string;
        demande: import("../entities/demande-inscription.entity").DemandeInscription;
    }>;
    onboardingSeen(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    achievements(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    allAchievements(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    checkAchievements(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    contacts(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    contactsCommerciaux(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    contactsFormateurs(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    contactsPoleRelation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    contactsPoleSave(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    progress(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    quizzes(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    rankingGlobal(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    rankingFormation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    rewards(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    partner(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    parainageStats(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    parainageHistory(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    parainageFilleuls(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    parainageRewards(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    parainageAccept(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    userFormations(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    userCatalogueFormations(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class ApiGeneralController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    getUser(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    getMe(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    getUserSettings(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    updateUserSettings(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any>>;
    reportUserAppUsage(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    updateUserPhoto(req: any, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    getUserPoints(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        points: number;
    }>>;
    updateFcmToken(req: any, token: string): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
