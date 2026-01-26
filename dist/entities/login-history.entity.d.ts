import { User } from "./user.entity";
export declare class LoginHistory {
    id: number;
    user_id: number;
    user: User;
    ip_address: string;
    country: string;
    city: string;
    device: string;
    browser: string;
    platform: string;
    login_at: Date;
    logout_at: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
