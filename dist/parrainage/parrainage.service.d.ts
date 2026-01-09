import { Repository, DataSource } from "typeorm";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { User } from "../entities/user.entity";
export declare class ParrainageService {
    private parrainageRepository;
    private parrainageTokenRepository;
    private parrainageEventRepository;
    private userRepository;
    private dataSource;
    constructor(parrainageRepository: Repository<Parrainage>, parrainageTokenRepository: Repository<ParrainageToken>, parrainageEventRepository: Repository<ParrainageEvent>, userRepository: Repository<User>, dataSource: DataSource);
    generateLink(userId: number): Promise<{
        success: boolean;
        token: string;
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        parrain: any;
    }>;
    getStatsParrain(userId: number): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getEvents(): Promise<{
        success: boolean;
        data: ParrainageEvent[];
    }>;
    getFilleuls(parrainId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            date: Date;
            points: number;
            status: string;
        }[];
    }>;
}
