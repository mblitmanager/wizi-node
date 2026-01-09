import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";
export declare class AdminSettingsController {
    private settingRepository;
    constructor(settingRepository: Repository<Setting>);
    getSettings(): Promise<{
        data: any;
    }>;
    updateSettings(body: any): Promise<{
        data: any;
        message: string;
    }>;
}
