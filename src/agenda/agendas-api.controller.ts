import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  NotFoundException,
  Headers,
  HttpStatus,
  HttpException,
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
@Roles(
  "administrateur",
  "admin",
  "formateur",
  "formatrice",
  "commercial",
  "stagiaire"
)
export class AgendasApiController {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private agendaService: AgendaService
  ) {}

  @Post("/sync")
  async syncGoogleCalendar(
    @Body() body: any,
    @Headers("x-sync-secret") secret: string
  ) {
    if (
      !process.env.SYNC_API_SECRET ||
      secret !== process.env.SYNC_API_SECRET
    ) {
      throw new HttpException(
        "Non autorisé. Clé secrète invalide ou manquante.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const { userId, calendars, events } = body;

    if (!userId || !calendars || !events) {
      throw new HttpException(
        "Paramètres manquants. userId, calendars, et events sont requis.",
        HttpStatus.BAD_REQUEST
      );
    }

    // Ici, vous appellerez une méthode du service pour gérer la sauvegarde
    const result = await this.agendaService.syncGoogleCalendarData(
      userId,
      calendars,
      events
    );

    return {
      message: "Synchronisation Google Calendar réussie.",
      userId: result.userId,
      calendarsSynced: result.calendarsSynced,
      eventsSynced: result.eventsSynced,
    };
  }

  @Get()
  async getAll(
    @Request() req: any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 30
  ) {
    const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
    const limitNum =
      typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
    const skip = (pageNum - 1) * limitNum;

    const queryOptions: any = {
      skip,
      take: limitNum,
      order: { date_debut: "DESC" },
      relations: ["stagiaire"],
    };

    // If user is a stagiaire, they only see their own agenda
    if (req.user.role === "stagiaire") {
      // Find the stagiaire record first if not already available in user object
      const stagiaireId = req.user.stagiaire?.id;
      if (stagiaireId) {
        queryOptions.where = { stagiaire_id: stagiaireId };
      } else {
        // Fallback: if we can't find stagiaire ID, return empty as they shouldn't see others
        return {
          "@context": "/api/contexts/Agenda",
          "@id": "/api/agendas",
          "@type": "Collection",
          member: [],
          totalItems: 0,
        };
      }
    }

    const [data, total] =
      await this.agendaRepository.findAndCount(queryOptions);

    const members = data.map((item) =>
      this.agendaService.formatAgendaJsonLd(item)
    );

    return {
      "@context": "/api/contexts/Agenda",
      "@id": "/api/agendas",
      "@type": "Collection",
      member: members,
      totalItems: total,
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
