import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
export declare class AdminFormateurController {
    private formateurRepository;
    constructor(formateurRepository: Repository<Formateur>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Formateur[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<Formateur>;
    create(data: any): Promise<Formateur[]>;
    update(id: number, data: any): Promise<Formateur>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
