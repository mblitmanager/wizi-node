import { ChallengeService } from "./challenge.service";
export declare class ChallengeController {
    private challengeService;
    constructor(challengeService: ChallengeService);
    getConfig(): Promise<{
        active_challenge: import("../entities/challenge.entity").Challenge;
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
    getEntries(req: any): Promise<import("../entities/challenge.entity").Challenge[]>;
}
