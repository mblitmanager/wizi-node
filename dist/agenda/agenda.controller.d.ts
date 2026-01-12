import { AgendaService } from "./agenda.service";
import { Response } from "express";
export declare class AgendaController {
    private agendaService;
    constructor(agendaService: AgendaService);
    getAgenda(req: any): Promise<{
        formations: import("../entities/formation.entity").Formation[];
        events: import("../entities/agenda.entity").Agenda[];
        upcoming_events: import("../entities/agenda.entity").Agenda[];
    }>;
    exportAgenda(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getNotifications(req: any): Promise<import("../entities/notification.entity").Notification[]>;
    markAsRead(id: number): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
}
