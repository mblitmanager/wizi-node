export declare class AdminParametreController {
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
    resetDataForm(): Promise<{
        message: string;
    }>;
    resetData(): Promise<{
        message: string;
    }>;
    updateImage(id: number, data: any): Promise<{
        id: number;
        message: string;
        data: any;
    }>;
}
export declare class AdminClassementController {
    constructor();
    index(): Promise<{
        data: any[];
        message: string;
    }>;
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
