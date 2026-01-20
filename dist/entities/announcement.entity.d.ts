import { User } from "./user.entity";
export declare class Announcement {
    id: number;
    title: string;
    message: string;
    target_audience: string;
    recipient_ids: number[];
    scheduled_at: Date;
    sent_at: Date;
    status: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    creator: User;
}
