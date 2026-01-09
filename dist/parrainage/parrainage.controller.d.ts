import { Repository } from "typeorm";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
export declare class ParrainageController {
    private parrainageEventRepository;
    constructor(parrainageEventRepository: Repository<ParrainageEvent>);
    getEvents(): Promise<{
        success: boolean;
        data: ParrainageEvent[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
