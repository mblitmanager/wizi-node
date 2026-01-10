export declare class AdminPermissionController {
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
    toggleStatus(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
export declare class AdminRoleController {
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
    toggleStatus(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
