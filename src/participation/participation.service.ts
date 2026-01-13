import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Participation } from "../entities/participation.entity";

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>
  ) {}

  async findAll(page: number = 1, perPage: number = 20, baseUrl: string = "") {
    const [data, total] = await this.participationRepository
      .createQueryBuilder("p")
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((p) => ({
      "@id": `/api/participations/${p.id}`,
      "@type": "Participation",
      id: p.id,
      stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
      quiz_id: `/api/quizzes/${p.quiz_id}`,
      date: p.date,
      heure: p.heure,
      score: p.score,
      deja_jouer: p.deja_jouer,
      current_question_id: p.current_question_id,
      created_at: p.created_at?.toISOString(),
      updated_at: p.updated_at?.toISOString(),
    }));

    return {
      member: formattedData,
      totalItems: total,
      view: {
        "@id": `${baseUrl}?page=${page}`,
        "@type": "hydra:PartialCollectionView",
        first: `${baseUrl}?page=1`,
        last: `${baseUrl}?page=${Math.ceil(total / perPage)}`,
        next:
          page < Math.ceil(total / perPage)
            ? `${baseUrl}?page=${page + 1}`
            : undefined,
        previous: page > 1 ? `${baseUrl}?page=${page - 1}` : undefined,
      },
    };
  }

  async findOne(id: number) {
    const p = await this.participationRepository.findOne({
      where: { id },
    });
    if (!p) return null;

    return {
      "@context": "/api/contexts/Participation",
      "@id": `/api/participations/${p.id}`,
      "@type": "Participation",
      id: p.id,
      stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
      quiz_id: `/api/quizzes/${p.quiz_id}`,
      date: p.date,
      heure: p.heure,
      score: p.score,
      deja_jouer: p.deja_jouer,
      current_question_id: p.current_question_id,
      created_at: p.created_at?.toISOString(),
      updated_at: p.updated_at?.toISOString(),
    };
  }
}
