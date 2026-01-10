import { AdminService } from "./admin.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class FormateurController {
    private readonly adminService;
    private apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getDashboardStats(req: any): Promise<any>;
    getOnlineStagiaires(): Promise<any>;
}
