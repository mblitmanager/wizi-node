import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
export declare class CommercialController {
    private commercialRepository;
    constructor(commercialRepository: Repository<Commercial>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Commercial[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Commercial>;
    create(data: any): Promise<Commercial[]>;
    update(id: number, data: any): Promise<Commercial>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
