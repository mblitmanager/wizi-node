import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
export declare class AdminFormationController {
    private formationRepository;
    constructor(formationRepository: Repository<Formation>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Formation[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Formation>;
    create(data: any): Promise<Formation[]>;
    update(id: number, data: any): Promise<Formation>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    duplicate(id: number): Promise<Formation>;
}
