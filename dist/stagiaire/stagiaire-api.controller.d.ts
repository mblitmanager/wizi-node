export declare class StagiaireApiController {
    constructor();
    profile(req: any): Promise<{
        user: any;
        message: string;
    }>;
    updateProfile(req: any, data: any): Promise<{
        user: any;
        message: string;
    }>;
    patchProfile(req: any, data: any): Promise<{
        user: any;
        message: string;
    }>;
    uploadProfilePhoto(req: any, data: any): Promise<{
        message: string;
    }>;
    show(req: any): Promise<{
        user: any;
    }>;
    dashboardHome(req: any): Promise<{
        message: string;
        user: any;
    }>;
    formations(req: any): Promise<{
        data: any[];
        message: string;
    }>;
    formationClassement(): Promise<{
        data: any[];
        message: string;
    }>;
    inscriptionCatalogueFormation(req: any, data: any): Promise<{
        message: string;
    }>;
    onboardingSeen(req: any): Promise<{
        message: string;
    }>;
    achievements(req: any): Promise<{
        data: any[];
        message: string;
    }>;
    allAchievements(): Promise<{
        data: any[];
        message: string;
    }>;
    checkAchievements(): Promise<{
        message: string;
    }>;
    contacts(): Promise<{
        data: any[];
        message: string;
    }>;
    contactsCommerciaux(): Promise<{
        data: any[];
        message: string;
    }>;
    contactsFormateurs(): Promise<{
        data: any[];
        message: string;
    }>;
    contactsPoleRelation(): Promise<{
        data: any[];
        message: string;
    }>;
    contactsPoleSave(): Promise<{
        data: any[];
        message: string;
    }>;
    progress(): Promise<{
        data: {};
        message: string;
    }>;
    quizzes(): Promise<{
        data: any[];
        message: string;
    }>;
    rankingGlobal(): Promise<{
        data: any[];
        message: string;
    }>;
    rankingFormation(): Promise<{
        data: any[];
        message: string;
    }>;
    rewards(): Promise<{
        data: any[];
        message: string;
    }>;
    partner(): Promise<{
        data: {};
        message: string;
    }>;
    parainageStats(): Promise<{
        data: {};
        message: string;
    }>;
    parainageHistory(): Promise<{
        data: any[];
        message: string;
    }>;
    parainageFilleuls(): Promise<{
        data: any[];
        message: string;
    }>;
    parainageRewards(): Promise<{
        data: any[];
        message: string;
    }>;
    parainageAccept(data: any): Promise<{
        message: string;
    }>;
    userFormations(id: number): Promise<{
        data: any[];
        message: string;
    }>;
    userCatalogueFormations(id: number): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class ApiGeneralController {
    constructor();
    getUser(req: any): Promise<{
        user: any;
    }>;
    getMe(req: any): Promise<{
        user: any;
    }>;
    getUserSettings(req: any): Promise<{
        settings: {};
        user: any;
    }>;
    updateUserSettings(req: any, data: any): Promise<{
        settings: any;
        message: string;
    }>;
    reportUserAppUsage(req: any, data: any): Promise<{
        message: string;
    }>;
    updateUserPhoto(req: any, data: any): Promise<{
        message: string;
    }>;
    getUserPoints(req: any): Promise<{
        points: number;
        user: any;
    }>;
    updateFcmToken(req: any, token: string): Promise<{
        message: string;
    }>;
}
