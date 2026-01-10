import { ApiResponseService } from "../common/services/api-response.service";
export declare class QuizApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    byFormations(): Promise<any>;
    categories(): Promise<any>;
    byCategory(): Promise<any>;
    globalClassement(): Promise<any>;
    history(): Promise<any>;
    stats(): Promise<any>;
    statsCategories(): Promise<any>;
    statsPerformance(): Promise<any>;
    statsProgress(): Promise<any>;
    statsTrends(): Promise<any>;
    getById(id: number): Promise<any>;
    submitResult(id: number, data: any): Promise<any>;
    getQuestions(quizId: number): Promise<any>;
    submit(quizId: number, data: any): Promise<any>;
    getParticipation(quizId: number): Promise<any>;
    startParticipation(quizId: number): Promise<any>;
    saveProgress(quizId: number, data: any): Promise<any>;
    resumeParticipation(quizId: number): Promise<any>;
    complete(quizId: number): Promise<any>;
    getStatistics(quizId: number): Promise<any>;
    getUserParticipations(quizId: number): Promise<any>;
}
export declare class FormationApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    categories(): Promise<any>;
    listFormation(): Promise<any>;
}
export declare class FormationsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    byCategory(): Promise<any>;
    classementSummary(): Promise<any>;
    classement(): Promise<any>;
}
export declare class CatalogueFormationsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    formations(): Promise<any>;
    getFormation(): Promise<any>;
    getPdf(): Promise<any>;
    stagiaireFormations(): Promise<any>;
    withFormations(): Promise<any>;
}
export declare class FormationParrainageApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    formations(): Promise<any>;
}
export declare class MediasApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    astuces(): Promise<any>;
    tutoriels(): Promise<any>;
    formationsWithStatus(): Promise<any>;
    interactiveFormations(): Promise<any>;
    astucesByFormation(): Promise<any>;
    tutorielsByFormation(): Promise<any>;
    serverVideos(): Promise<any>;
    uploadVideo(data: any): Promise<any>;
    markAsWatched(): Promise<any>;
}
export declare class MediaApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    stream(): Promise<any>;
    subtitle(): Promise<any>;
}
