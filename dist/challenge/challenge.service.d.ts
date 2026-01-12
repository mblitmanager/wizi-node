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
        points: number;
        completed_challenges: number;
    }[]>;
    getChallengeEntries(userId: number): Promise<Challenge[]>;
}
