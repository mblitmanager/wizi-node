import { Formation } from "./formation.entity";
export declare class Quiz {
    id: number;
    titre: string;
    description: string;
    formation_id: number;
    formation: Formation;
    created_at: Date;
    updated_at: Date;
}
