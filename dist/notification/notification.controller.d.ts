import { NotificationService } from "./notification.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class NotificationController {
    private readonly notificationService;
    private readonly apiResponse;
    constructor(notificationService: NotificationService, apiResponse: ApiResponseService);
    getNotifications(req: any): Promise<any>;
    getUnreadCount(req: any): Promise<any>;
    markAsRead(id: number): Promise<any>;
    markAllAsRead(req: any): Promise<any>;
    deleteNotification(id: number): Promise<any>;
}
