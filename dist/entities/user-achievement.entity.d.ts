import { Stagiaire } from "./stagiaire.entity";
import { Achievement } from "./achievement.entity";
export declare class UserAchievement {
    id: number;
    user_id: number;
    achievement_id: number;
    unlocked_at: Date;
    created_at: Date;
    updated_at: Date;
    stagiaire: Stagiaire;
    achievement: Achievement;
}
