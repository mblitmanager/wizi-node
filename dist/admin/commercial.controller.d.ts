import { AdminService } from "./admin.service";
export declare class CommercialController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(req: any): Promise<{
        success: boolean;
        stats: {
            total_leads: number;
            conversions: number;
            active_partners: number;
        };
    }>;
}
