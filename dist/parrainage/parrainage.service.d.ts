import { Repository } from "typeorm";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { User } from "../entities/user.entity";
export declare class ParrainageService {
    private parrainageRepository;
    private tokenRepository;
    private userRepository;
    constructor(parrainageRepository: Repository<Parrainage>, tokenRepository: Repository<ParrainageToken>, userRepository: Repository<User>);
    generateLink(userId: number): Promise<{
        success: boolean;
        token: string;
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        message: string;
        parrain?: undefined;
    } | {
        success: boolean;
        parrain: any;
        message?: undefined;
    }>;
    getStatsParrain(userId: number): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
}
