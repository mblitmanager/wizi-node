import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
import { GoogleCalendar } from "../entities/google-calendar.entity";
import { GoogleCalendarEvent } from "../entities/google-calendar-event.entity";
import { Formateur } from "../entities/formateur.entity";
import { User } from "../entities/user.entity";
import { ConfigService } from "@nestjs/config";
export declare class AgendaService {
    private agendaRepository;
    private stagiaireRepository;
    private notificationRepository;
    private googleCalendarRepository;
    private googleCalendarEventRepository;
    private formateurRepository;
    private userRepository;
    private configService;
    private oauth2Client;
    constructor(agendaRepository: Repository<Agenda>, stagiaireRepository: Repository<Stagiaire>, notificationRepository: Repository<Notification>, googleCalendarRepository: Repository<GoogleCalendar>, googleCalendarEventRepository: Repository<GoogleCalendarEvent>, formateurRepository: Repository<Formateur>, userRepository: Repository<User>, configService: ConfigService);
    getStagiaireAgenda(userId: number): Promise<{
        formations: import("../entities/formation.entity").Formation[];
        events: Agenda[];
        upcoming_events: Agenda[];
    }>;
    getFormateurAgenda(userId: number): Promise<{
        agendaEvents: any[];
        googleCalendarEvents: any[];
    }>;
    exportAgendaToICS(userId: number): Promise<string>;
    getStagiaireNotifications(userId: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number): Promise<boolean>;
    markAllNotificationsAsRead(userId: number): Promise<boolean>;
    private formatDateForICS;
    syncGoogleCalendarData(userId: string, calendars: any[], events: any[]): Promise<{
        calendarsSynced: number;
        eventsSynced: number;
    }>;
    exchangeCodeForToken(userId: number, code: string): Promise<any>;
    syncUserEvents(userId: number): Promise<{
        calendarsSynced: number;
        eventsSynced: number;
    }>;
    syncAllUsers(): Promise<any[]>;
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
