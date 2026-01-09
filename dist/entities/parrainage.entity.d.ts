import { User } from "./user.entity";
export declare class Parrainage {
    id: number;
    filleul_id: number;
    parrain_id: number;
    date_parrainage: Date;
    points: number;
    gains: number;
    filleul: User;
    parrain: User;
    created_at: Date;
    updated_at: Date;
}
