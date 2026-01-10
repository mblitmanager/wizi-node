import { ApiResponseService } from "../common/services/api-response.service";
export declare class QuizApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    byFormations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    categories(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    byCategory(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    globalClassement(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    history(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    stats(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    statsCategories(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    statsPerformance(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    statsProgress(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    statsTrends(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    getById(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    submitResult(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    getQuestions(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    submit(quizId: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    getParticipation(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    startParticipation(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    saveProgress(quizId: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    resumeParticipation(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    complete(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    getStatistics(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    getUserParticipations(quizId: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class FormationApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    categories(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    listFormation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class FormationsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    byCategory(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    classementSummary(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    classement(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
}
export declare class CatalogueFormationsApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    formations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    getFormation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{}>>;
    getPdf(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    stagiaireFormations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    withFormations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class FormationParrainageApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    formations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
}
export declare class MediasApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    astuces(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    tutoriels(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    formationsWithStatus(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    interactiveFormations(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    astucesByFormation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    tutorielsByFormation(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    serverVideos(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<any[]>>;
    uploadVideo(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    markAsWatched(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
export declare class MediaApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    stream(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    subtitle(): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
