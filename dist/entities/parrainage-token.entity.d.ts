import { User } from "./user.entity";
export declare class ParrainageToken {
    id: number;
    token: string;
    user_id: number;
    parrain_data: string;
    expires_at: Date;
    user: User;
    created_at: Date;
    updated_at: Date;
}
