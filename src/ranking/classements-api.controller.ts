import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RankingService } from "./ranking.service";

@Controller("classements")
@UseGuards(AuthGuard("jwt"))
export class ClassementsApiController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("formation_id") formationId?: number,
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { items, total } = await this.rankingService.findAllPaginated(
      pageNum,
      limitNum,
      formationId,
    );

    const members = items.map((c) => ({
      "@id": `/api/classements/${c.id}`,
      "@type": "Classement",
      id: c.id,
      rang: c.rang,
      points: c.points?.toString() || "0",
      createdAt: c.created_at?.toISOString().replace("Z", "+00:00"),
      updatedAt: c.updated_at?.toISOString().replace("Z", "+00:00"),
      stagiaire: `/api/stagiaires/${c.stagiaire_id}`,
      quiz: `/api/quizzes/${c.quiz_id}`,
    }));

    const lastPage = Math.ceil(total / limitNum);

    return {
      "@context": "/api/contexts/Classement",
      "@id": "/api/classements",
      "@type": "Collection",
      totalItems: total,
      member: members,
      view: {
        "@id": `/api/classements?page=${pageNum}`,
        "@type": "PartialCollectionView",
        first: `/api/classements?page=1`,
        last: `/api/classements?page=${lastPage}`,
        next:
          pageNum < lastPage ? `/api/classements?page=${pageNum + 1}` : null,
      },
    };
  }
}
