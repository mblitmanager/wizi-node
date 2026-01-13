import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";

@Injectable()
export class PoleRelationClientService {
  constructor(
    @InjectRepository(PoleRelationClient)
    private prcRepository: Repository<PoleRelationClient>
  ) {}

  async findAll(page: number = 1, perPage: number = 10, baseUrl: string = "") {
    const [data, total] = await this.prcRepository
      .createQueryBuilder("p")
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((p) => ({
      "@id": `/api/pole_relation_clients/${p.id}`,
      "@type": "PoleRelationClient",
      id: p.id,
      role: p.role,
      stagiaire_id: p.stagiaire_id,
      user_id: p.user_id ? `/api/users/${p.user_id}` : null,
      prenom: p.prenom,
      telephone: p.telephone,
      created_at: p.created_at?.toISOString(),
      updated_at: p.updated_at?.toISOString(),
    }));

    return {
      "hydra:member": formattedData,
      "hydra:totalItems": total,
      "hydra:view": {
        "@id": `${baseUrl}?page=${page}`,
        "@type": "hydra:PartialCollectionView",
        "hydra:first": `${baseUrl}?page=1`,
        "hydra:last": `${baseUrl}?page=${Math.ceil(total / perPage)}`,
        "hydra:next":
          page < Math.ceil(total / perPage)
            ? `${baseUrl}?page=${page + 1}`
            : undefined,
        "hydra:previous": page > 1 ? `${baseUrl}?page=${page - 1}` : undefined,
      },
    };
  }

  async findOne(id: number) {
    const p = await this.prcRepository.findOne({
      where: { id },
    });
    if (!p) return null;

    return {
      "@context": "/api/contexts/PoleRelationClient",
      "@id": `/api/pole_relation_clients/${p.id}`,
      "@type": "PoleRelationClient",
      id: p.id,
      role: p.role,
      stagiaire_id: p.stagiaire_id,
      user_id: p.user_id ? `/api/users/${p.user_id}` : null,
      prenom: p.prenom,
      telephone: p.telephone,
      created_at: p.created_at?.toISOString(),
      updated_at: p.updated_at?.toISOString(),
    };
  }
}
