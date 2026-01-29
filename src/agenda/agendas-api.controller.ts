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
import { Repository, In } from "typeorm";
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
  "stagiaire",
)
export class AgendasApiController {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private agendaService: AgendaService,
  ) {}

  @Post("/sync")
  @Roles("administrateur", "admin", "formateur", "formatrice")
  async syncGoogleCalendar(@Request() req: any, @Body() body: any) {
    const { authCode } = body;
    const isAdmin =
      req.user.role === "administrateur" || req.user.role === "admin";

    if (authCode) {
      // Logic to exchange code and sync THIS user
      await this.agendaService.exchangeCodeForToken(req.user.id, authCode);
      const result = await this.agendaService.syncUserEvents(req.user.id);
      return {
        message: "Synchronisation de votre compte réussie.",
        info: result,
      };
    } else if (isAdmin) {
      // Sync ALL users (standard admin task)
      const results = await this.agendaService.syncAllUsers();
      return {
        message: "Synchronisation globale de tous les comptes lancée.",
        results,
      };
    } else {
      throw new HttpException(
        "Seul l'administrateur peut lancer la synchronisation globale.",
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get()
  async getAll(
    @Request() req: any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 30,
  ) {
    const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
    const limitNum =
      typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
    const skip = (pageNum - 1) * limitNum;

    // logic for formateurs: use google_calendar_events
    if (req.user.role === "formateur" || req.user.role === "formatrice") {
      const googleCalendars = await this.agendaService[
        "googleCalendarRepository"
      ].find({
        where: { user_id: req.user.id },
      });

      const calendarIds = googleCalendars.map((c) => c.id);
      if (calendarIds.length === 0) {
        return {
          "@context": "/api/contexts/Agenda",
          "@id": "/api/agendas",
          "@type": "Collection",
          member: [],
          totalItems: 0,
        };
      }

      const [events, total] = await this.agendaService[
        "googleCalendarEventRepository"
      ].findAndCount({
        where: { google_calendar_id: In(calendarIds) },
        order: { start: "DESC" },
        skip,
        take: limitNum,
      });

      const members = events.map((event) => ({
        "@type": "Agenda",
        id: event.id,
        titre: event.summary,
        description: event.description,
        date_debut: event.start.toISOString(),
        date_fin: event.end.toISOString(),
        location: event.location,
        googleId: event.google_id,
      }));

      return {
        "@context": "/api/contexts/Agenda",
        "@id": "/api/agendas",
        "@type": "Collection",
        member: members,
        totalItems: total,
      };
    }

    const queryOptions: any = {
      skip,
      take: limitNum,
      order: { date_debut: "DESC" },
      relations: ["stagiaire"],
    };

    // If user is a stagiaire, they only see their own agenda
    if (req.user.role === "stagiaire") {
      const stagiaireId = req.user.stagiaire?.id;
      if (stagiaireId) {
        queryOptions.where = { stagiaire_id: stagiaireId };
      } else {
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
      this.agendaService.formatAgendaJsonLd(item),
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
