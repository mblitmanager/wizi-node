import { Repository } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class RankingService {
    private classementRepository;
    private stagiaireRepository;
    constructor(classementRepository: Repository<Classement>, stagiaireRepository: Repository<Stagiaire>);
    getGlobalRanking(): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }[]>;
    getMyRanking(userId: number): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }>;
    calculateLevel(points: number): string;
    private groupBy;
}
