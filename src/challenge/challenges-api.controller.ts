import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChallengeService } from "./challenge.service";

@Controller("challenges")
@UseGuards(AuthGuard("jwt"))
export class ChallengesApiController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  async getAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { items, total } = await this.challengeService.findAll(
      pageNum,
      limitNum
    );

    const members = items.map((c) =>
      this.challengeService.formatChallengeJsonLd(c)
    );
    const lastPage = Math.ceil(total / limitNum);

    return {
      "@context": "/api/contexts/Challenge",
      "@id": "/api/challenges",
      "@type": "Collection",
      totalItems: total,
      member: members,
      view: {
        "@id": `/api/challenges?page=${pageNum}`,
        "@type": "PartialCollectionView",
        first: `/api/challenges?page=1`,
        last: `/api/challenges?page=${lastPage}`,
        next: pageNum < lastPage ? `/api/challenges?page=${pageNum + 1}` : null,
      },
    };
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    const challenge = await this.challengeService.findOne(id);
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return this.challengeService.formatChallengeJsonLd(challenge);
  }

  @Post()
  async create(@Body() data: any) {
    const challenge = await this.challengeService.create(data);
    return this.challengeService.formatChallengeJsonLd(challenge);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const challenge = await this.challengeService.update(id, data);
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return this.challengeService.formatChallengeJsonLd(challenge);
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.challengeService.delete(id);
    return null;
  }
}
