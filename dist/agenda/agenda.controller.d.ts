import { AgendaService } from "./agenda.service";
import { Response } from "express";
export declare class AgendaController {
    private agendaService;
    constructor(agendaService: AgendaService);
    getAgenda(req: any): Promise<{
        formations: any[];
        events: import("../entities/agenda.entity").Agenda[];
        upcoming_events: import("../entities/agenda.entity").Agenda[];
    }>;
    exportAgenda(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getNotifications(req: any): Promise<import("../entities/notification.entity").Notification[]>;
}
