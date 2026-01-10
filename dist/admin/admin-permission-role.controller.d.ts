import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminPermissionController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    toggleStatus(id: number): Promise<any>;
}
export declare class AdminRoleController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<any>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    toggleStatus(id: number): Promise<any>;
}
