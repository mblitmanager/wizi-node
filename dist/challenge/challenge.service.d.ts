import { Repository } from "typeorm";
import { Challenge } from "../entities/challenge.entity";
import { Progression } from "../entities/progression.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
export declare class ChallengeService {
    private challengeRepository;
    private progressionRepository;
    private stagiaireRepository;
    private participationRepository;
    constructor(challengeRepository: Repository<Challenge>, progressionRepository: Repository<Progression>, stagiaireRepository: Repository<Stagiaire>, participationRepository: Repository<QuizParticipation>);
    findAll(page?: number, limit?: number): Promise<{
        items: Challenge[];
        total: number;
    }>;
    findOne(id: number): Promise<Challenge | null>;
    create(data: any): Promise<Challenge>;
    update(id: number, data: any): Promise<Challenge | null>;
    delete(id: number): Promise<import("typeorm").UpdateResult>;
    formatChallengeJsonLd(challenge: Challenge): {
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        date_debut: string;
        date_fin: string;
        points: string;
        participation_id: number;
        createdAt: string;
        updatedAt: string;
    };
    getChallengeConfig(): Promise<{
        active_challenge: Challenge;
        config: {
            points_multiplier: number;
            bonus_completion: number;
        };
    }>;
    getLeaderboard(): Promise<{
        rank: number;
        stagiaire_id: number;
        name: string;
        points: any;
        completed_challenges: any;
    }[]>;
    getChallengeEntries(userId: number): Promise<Challenge[]>;
}
