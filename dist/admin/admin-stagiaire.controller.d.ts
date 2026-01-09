import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class AdminStagiaireController {
    private stagiaireRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Stagiaire[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Stagiaire>;
    create(data: any): Promise<Stagiaire[]>;
    update(id: number, data: any): Promise<Stagiaire>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
