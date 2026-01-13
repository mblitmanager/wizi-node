import { PoleRelationClientService } from "./pole-relation-client.service";
export declare class PoleRelationClientController {
    private readonly prcService;
    constructor(prcService: PoleRelationClientService);
    findAll(page: string, req: any): Promise<{
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
        "hydra:view": {
            "@id": string;
            "@type": string;
            "hydra:first": string;
            "hydra:last": string;
            "hydra:next": string;
            "hydra:previous": string;
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
