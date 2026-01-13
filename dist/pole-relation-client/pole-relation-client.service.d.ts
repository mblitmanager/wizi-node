import { Repository } from "typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
export declare class PoleRelationClientService {
    private prcRepository;
    constructor(prcRepository: Repository<PoleRelationClient>);
    findAll(page?: number, perPage?: number, baseUrl?: string): Promise<{
        member: {
            "@id": string;
            "@type": string;
            id: number;
            role: string;
            stagiaire_id: number;
            user_id: string;
            prenom: string;
            telephone: string;
            created_at: string;
            updated_at: string;
        }[];
        totalItems: number;
        view: {
            "@id": string;
            "@type": string;
            first: string;
            last: string;
            next: string;
            previous: string;
        };
    }>;
    findOne(id: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        role: string;
        stagiaire_id: number;
        user_id: string;
        prenom: string;
        telephone: string;
        created_at: string;
        updated_at: string;
    }>;
}
