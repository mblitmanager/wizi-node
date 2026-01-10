import { AdminService } from "./admin.service";
export declare class FormateurController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(req: any): Promise<{
        total_stagiaires: number;
        active_this_week: number;
        inactive_count: number;
        never_connected: number;
        avg_quiz_score: number;
        total_formations: number;
        total_quizzes_taken: number;
        total_video_hours: number;
        formations: {
            data: any[];
        };
        formateurs: {
            data: any[];
        };
    }>;
    getOnlineStagiaires(): Promise<{
        stagiaires: {
            id: number;
            prenom: string;
            nom: string;
            email: string;
            last_activity_at: Date;
            formations: any[];
        }[];
        total: number;
    }>;
}
