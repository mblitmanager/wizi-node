import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminParametreController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    resetData(): Promise<any>;
    updateImage(id: number, data: any): Promise<any>;
}
export declare class AdminClassementController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
}
export declare class AdminParrainageController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(): Promise<any>;
    show(id: number): Promise<any>;
}
export declare class AdminPartenaireController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    store(data: any): Promise<any>;
    import(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    classements(id: number): Promise<any>;
}
export declare class AdminMediasController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
}
