import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { AgendaService } from "./agenda.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("agendas")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AgendasApiController {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private agendaService: AgendaService
  ) {}

  @Get()
  async getAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 30
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.agendaRepository.findAndCount({
      skip,
      take: limit,
      order: { date_debut: "DESC" },
    });

    const members = data.map((item) =>
      this.agendaService.formatAgendaJsonLd(item)
    );

    return {
      "@context": "/api/contexts/Agenda",
      "@id": "/api/agendas",
      "@type": "Collection",
      "hydra:member": members,
      "hydra:totalItems": total,
      "hydra:view": {
        "@id": `/api/agendas?page=${page}&limit=${limit}`,
        "@type": "PartialCollectionView",
        "hydra:first": `/api/agendas?page=1&limit=${limit}`,
        "hydra:last": `/api/agendas?page=${Math.ceil(total / limit)}&limit=${limit}`,
        "hydra:next":
          page < Math.ceil(total / limit)
            ? `/api/agendas?page=${page + 1}&limit=${limit}`
            : null,
      },
    };
  }

  @Post()
  @Roles("administrateur", "admin")
  async create(@Body() body: any) {
    const agenda = this.agendaRepository.create({
      titre: body.titre,
      description: body.description,
      date_debut: body.date_debut ? new Date(body.date_debut) : null,
      date_fin: body.date_fin ? new Date(body.date_fin) : null,
      evenement: body.evenement,
      commentaire: body.commentaire,
      stagiaire_id: body.stagiaire_id,
    });

    const saved = await this.agendaRepository.save(agenda);
    return this.agendaService.formatAgendaJsonLd(saved);
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    const agenda = await this.agendaRepository.findOne({
      where: { id },
    });

    if (!agenda) {
      throw new NotFoundException("Agenda non trouvé");
    }

    return this.agendaService.formatAgendaJsonLd(agenda);
  }

  @Patch(":id")
  @Roles("administrateur", "admin")
  async update(@Param("id") id: number, @Body() body: any) {
    const agenda = await this.agendaRepository.findOne({
      where: { id },
    });

    if (!agenda) {
      throw new NotFoundException("Agenda non trouvé");
    }

    Object.assign(agenda, {
      titre: body.titre ?? agenda.titre,
      description: body.description ?? agenda.description,
      date_debut: body.date_debut
        ? new Date(body.date_debut)
        : agenda.date_debut,
      date_fin: body.date_fin ? new Date(body.date_fin) : agenda.date_fin,
      evenement: body.evenement ?? agenda.evenement,
      commentaire: body.commentaire ?? agenda.commentaire,
      stagiaire_id: body.stagiaire_id ?? agenda.stagiaire_id,
    });

    const updated = await this.agendaRepository.save(agenda);
    return this.agendaService.formatAgendaJsonLd(updated);
  }

  @Delete(":id")
  @Roles("administrateur", "admin")
  async delete(@Param("id") id: number) {
    const agenda = await this.agendaRepository.findOne({
      where: { id },
    });

    if (!agenda) {
      throw new NotFoundException("Agenda non trouvé");
    }

    await this.agendaRepository.remove(agenda);
    return { id, message: "Agenda supprimé avec succès" };
  }
}
