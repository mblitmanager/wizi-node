import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminSettingsController {
    private settingRepository;
    private apiResponse;
    constructor(settingRepository: Repository<Setting>, apiResponse: ApiResponseService);
    getSettings(): Promise<any>;
    updateSettings(body: any): Promise<any>;
}
