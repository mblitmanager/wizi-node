import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { AgendaService } from "./agenda.service";
export declare class AgendasApiController {
    private agendaRepository;
    private agendaService;
    constructor(agendaRepository: Repository<Agenda>, agendaService: AgendaService);
    getAll(page?: number, limit?: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        "hydra:member": {
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
        "hydra:totalItems": number;
        "hydra:view": {
            "@id": string;
            "@type": string;
            "hydra:first": string;
            "hydra:last": string;
            "hydra:next": string;
        };
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
