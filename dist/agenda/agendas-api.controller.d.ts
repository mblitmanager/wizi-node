import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { AgendaService } from "./agenda.service";
export declare class AgendasApiController {
    private agendaRepository;
    private agendaService;
    constructor(agendaRepository: Repository<Agenda>, agendaService: AgendaService);
    syncGoogleCalendar(req: any, body: any): Promise<{
        calendarsSynced: number;
        eventsSynced: number;
        message: string;
        userId: string;
    } | {
        message: string;
        info: {
            calendarsSynced: number;
            eventsSynced: number;
        };
        results?: undefined;
    } | {
        message: string;
        results: any[];
        info?: undefined;
    }>;
    getAll(req: any, page?: number, limit?: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        member: {
            "@type": string;
            id: number;
            titre: string;
            description: string;
            date_debut: string;
            date_fin: string;
            location: string;
            googleId: string;
        }[];
        totalItems: number;
    } | {
        "@context": string;
        "@id": string;
        "@type": string;
        member: {
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
        }[];
        totalItems: number;
    }>;
    create(body: any): Promise<{
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
    }>;
    getOne(id: number): Promise<{
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
    }>;
    update(id: number, body: any): Promise<{
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
    }>;
    delete(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
