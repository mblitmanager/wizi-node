import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class StagiaireService {
    private stagiaireRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>);
    getProfile(userId: number): Promise<Stagiaire>;
    getHomeData(userId: number): Promise<{
        stagiaire: Stagiaire;
        welcome_message: string;
    }>;
}
