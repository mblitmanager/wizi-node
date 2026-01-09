import { User } from "./user.entity";
export declare class ParrainageToken {
    id: number;
    token: string;
    user_id: number;
    user: User;
    parrain_data: any;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}
