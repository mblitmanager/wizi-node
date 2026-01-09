import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class AdminStagiaireController {
    private stagiaireRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>);
    findAll(page?: number, limit?: number): Promise<{
        data: Stagiaire[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    findOne(id: number): Promise<Stagiaire>;
    create(data: any): Promise<Stagiaire[]>;
    update(id: number, data: any): Promise<Stagiaire>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
