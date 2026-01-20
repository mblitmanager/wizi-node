import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
import { GoogleCalendar } from "../entities/google-calendar.entity";
import { GoogleCalendarEvent } from "../entities/google-calendar-event.entity";
export declare class AgendaService {
    private agendaRepository;
    private stagiaireRepository;
    private notificationRepository;
    private googleCalendarRepository;
    private googleCalendarEventRepository;
    constructor(agendaRepository: Repository<Agenda>, stagiaireRepository: Repository<Stagiaire>, notificationRepository: Repository<Notification>, googleCalendarRepository: Repository<GoogleCalendar>, googleCalendarEventRepository: Repository<GoogleCalendarEvent>);
    getStagiaireAgenda(userId: number): Promise<{
        formations: import("../entities/formation.entity").Formation[];
        events: Agenda[];
        upcoming_events: Agenda[];
    }>;
    exportAgendaToICS(userId: number): Promise<string>;
    getStagiaireNotifications(userId: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number): Promise<boolean>;
    markAllNotificationsAsRead(userId: number): Promise<boolean>;
    private formatDateForICS;
    syncGoogleCalendarData(userId: string, calendars: any[], events: any[]): Promise<{
        userId: string;
        calendarsSynced: number;
        eventsSynced: number;
    }>;
    formatAgendaJsonLd(agenda: Agenda): {
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        date_debut: string;
        date_fin: string;
        evenement: string;
        commentaire: string;
        stagiaire: string;
        created_at: string;
        updated_at: string;
    };
}
