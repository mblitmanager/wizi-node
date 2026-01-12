import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
export declare class AgendaService {
    private agendaRepository;
    private stagiaireRepository;
    private notificationRepository;
    constructor(agendaRepository: Repository<Agenda>, stagiaireRepository: Repository<Stagiaire>, notificationRepository: Repository<Notification>);
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
