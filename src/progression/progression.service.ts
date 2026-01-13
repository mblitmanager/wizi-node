import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Progression } from "../entities/progression.entity";

@Injectable()
export class ProgressionService {
  constructor(
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>
  ) {}

  async findAll(page: number = 1, perPage: number = 10, baseUrl: string = "") {
    const [data, total] = await this.progressionRepository
      .createQueryBuilder("p")
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((p) => ({
      "@id": `/api/progressions/${p.id}`,
      "@type": "Progression",
      id: p.id,
      termine: p.termine,
      stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
      quiz_id: p.quiz_id ? `/api/quizzes/${p.quiz_id}` : null,
      formation_id: p.formation_id ? `/api/formations/${p.formation_id}` : null,
      pourcentage: p.pourcentage,
      explication: p.explication,
      score: p.score,
      correct_answers: p.correct_answers,
      total_questions: p.total_questions,
      time_spent: p.time_spent,
      completion_time: p.completion_time?.toISOString(),
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
    const p = await this.progressionRepository.findOne({
      where: { id },
    });
    if (!p) return null;

    return {
      "@context": "/api/contexts/Progression",
      "@id": `/api/progressions/${p.id}`,
      "@type": "Progression",
      id: p.id,
      termine: p.termine,
      stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
      quiz_id: p.quiz_id ? `/api/quizzes/${p.quiz_id}` : null,
      formation_id: p.formation_id ? `/api/formations/${p.formation_id}` : null,
      pourcentage: p.pourcentage,
      explication: p.explication,
      score: p.score,
      correct_answers: p.correct_answers,
      total_questions: p.total_questions,
      time_spent: p.time_spent,
      completion_time: p.completion_time?.toISOString(),
      created_at: p.created_at?.toISOString(),
      updated_at: p.updated_at?.toISOString(),
    };
  }
}
