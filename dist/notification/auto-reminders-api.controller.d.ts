import { ApiResponseService } from "../common/services/api-response.service";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
export declare class AutoRemindersApiController {
    private apiResponse;
    private notificationRepository;
    constructor(apiResponse: ApiResponseService, notificationRepository: Repository<Notification>);
    history(req: any, page?: number): Promise<{
        current_page: number;
        data: {
            id: number;
            message: string;
            data: any;
            type: string;
            title: string;
            read: boolean;
            user_id: number;
            created_at: string;
            updated_at: string;
            user: {
                id: number;
                name: string;
                email: string;
            };
        }[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }>;
    private generatePaginationLinks;
    stats(): Promise<any>;
    targeted(): Promise<any>;
    run(): Promise<any>;
}
