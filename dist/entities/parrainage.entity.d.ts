import { User } from "./user.entity";
export declare class Parrainage {
    id: number;
    filleul_id: number;
    filleul: User;
    parrain_id: number;
    parrain: User;
    date_parrainage: Date;
    points: number;
    gains: number;
    created_at: Date;
    updated_at: Date;
}
