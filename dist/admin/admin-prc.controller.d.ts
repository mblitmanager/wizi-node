import { Repository } from "typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
export declare class AdminPoleRelationClientController {
    private prcRepository;
    constructor(prcRepository: Repository<PoleRelationClient>);
    index(page?: number, limit?: number, search?: string): Promise<{
        data: PoleRelationClient[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<PoleRelationClient[]>;
    show(id: number): Promise<PoleRelationClient>;
    edit(id: number): Promise<{
        form: PoleRelationClient;
    }>;
    update(id: number, data: any): Promise<PoleRelationClient>;
    destroy(id: number): Promise<import("typeorm").DeleteResult>;
}
