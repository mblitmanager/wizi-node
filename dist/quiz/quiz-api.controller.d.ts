export declare class QuizApiController {
    constructor();
    byFormations(): Promise<{
        data: {};
        message: string;
    }>;
    categories(): Promise<{
        data: any[];
        message: string;
    }>;
    byCategory(): Promise<{
        data: any[];
        message: string;
    }>;
    globalClassement(): Promise<{
        data: any[];
        message: string;
    }>;
    history(): Promise<{
        data: any[];
        message: string;
    }>;
    stats(): Promise<{
        data: {};
        message: string;
    }>;
    statsCategories(): Promise<{
        data: {};
        message: string;
    }>;
    statsPerformance(): Promise<{
        data: {};
        message: string;
    }>;
    statsProgress(): Promise<{
        data: {};
        message: string;
    }>;
    statsTrends(): Promise<{
        data: {};
        message: string;
    }>;
    getById(id: number): Promise<{
        data: {};
        message: string;
    }>;
    submitResult(id: number, data: any): Promise<{
        message: string;
    }>;
    getQuestions(quizId: number): Promise<{
        data: any[];
        message: string;
    }>;
    submit(quizId: number, data: any): Promise<{
        message: string;
    }>;
    getParticipation(quizId: number): Promise<{
        data: {};
        message: string;
    }>;
    startParticipation(quizId: number): Promise<{
        message: string;
    }>;
    saveProgress(quizId: number, data: any): Promise<{
        message: string;
    }>;
    resumeParticipation(quizId: number): Promise<{
        data: {};
        message: string;
    }>;
    complete(quizId: number): Promise<{
        message: string;
    }>;
    getStatistics(quizId: number): Promise<{
        data: {};
        message: string;
    }>;
    getUserParticipations(quizId: number): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class FormationApiController {
    constructor();
    categories(): Promise<{
        data: any[];
        message: string;
    }>;
    listFormation(): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class FormationsApiController {
    constructor();
    byCategory(): Promise<{
        data: any[];
        message: string;
    }>;
    classementSummary(): Promise<{
        data: {};
        message: string;
    }>;
    classement(): Promise<{
        data: {};
        message: string;
    }>;
}
export declare class CatalogueFormationsApiController {
    constructor();
    formations(): Promise<{
        data: any[];
        message: string;
    }>;
    getFormation(): Promise<{
        data: {};
        message: string;
    }>;
    getPdf(): Promise<{
        message: string;
    }>;
    stagiaireFormations(): Promise<{
        data: any[];
        message: string;
    }>;
    withFormations(): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class FormationParrainageApiController {
    constructor();
    formations(): Promise<{
        data: any[];
        message: string;
    }>;
}
export declare class MediasApiController {
    constructor();
    astuces(): Promise<{
        data: any[];
        message: string;
    }>;
    tutoriels(): Promise<{
        data: any[];
        message: string;
    }>;
    formationsWithStatus(): Promise<{
        data: any[];
        message: string;
    }>;
    interactiveFormations(): Promise<{
        data: any[];
        message: string;
    }>;
    astucesByFormation(): Promise<{
        data: any[];
        message: string;
    }>;
    tutorielsByFormation(): Promise<{
        data: any[];
        message: string;
    }>;
    serverVideos(): Promise<{
        data: any[];
        message: string;
    }>;
    uploadVideo(data: any): Promise<{
        message: string;
    }>;
    markAsWatched(): Promise<{
        message: string;
    }>;
}
export declare class MediaApiController {
    constructor();
    stream(): Promise<{
        message: string;
    }>;
    subtitle(): Promise<{
        message: string;
    }>;
}
