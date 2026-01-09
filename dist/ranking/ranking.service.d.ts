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
        id: any;
        firstname: any;
        lastname: any;
        name: any;
        image: any;
        score: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
        formateurs: any;
    }[]>;
    getMyRanking(userId: number): Promise<{
        rang: number;
        level: string;
        id: any;
        firstname: any;
        lastname: any;
        name: any;
        image: any;
        score: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
        formateurs: any;
    }>;
    calculateLevel(points: number): string;
    private groupBy;
}
