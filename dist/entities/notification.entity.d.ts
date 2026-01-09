import { User } from "./user.entity";
export declare class Notification {
    id: number;
    user_id: number;
    user: User;
    type: string;
    message: string;
    data: any;
    read: boolean;
    created_at: Date;
    updated_at: Date;
}
