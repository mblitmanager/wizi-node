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
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
    show(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
export declare class AdminPartenaireController {
    constructor();
    index(page?: number, limit?: number, search?: string): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<{
        message: string;
        data: any;
    }>;
    import(data: any): Promise<{
        message: string;
        data: any;
    }>;
    show(id: number): Promise<{
        id: number;
        message: string;
    }>;
    edit(id: number): Promise<{
        id: number;
        message: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        message: string;
        data: any;
    }>;
    destroy(id: number): Promise<{
        id: number;
        message: string;
    }>;
    classements(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
export declare class AdminMediasController {
    constructor();
    index(page?: number, limit?: number, search?: string): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<{
        message: string;
        data: any;
    }>;
    show(id: number): Promise<{
        id: number;
        message: string;
    }>;
    edit(id: number): Promise<{
        id: number;
        message: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        message: string;
        data: any;
    }>;
    destroy(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
