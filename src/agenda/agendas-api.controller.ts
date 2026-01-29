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
import { SyncAuthGuard } from "../common/guards/sync-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("agendas")
export class AgendasApiController {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private agendaService: AgendaService,
  ) {}

  @Post("/sync")
  @UseGuards(SyncAuthGuard)
  async syncGoogleCalendar(@Request() req: any, @Body() body: any) {
    // 1. JWT Flow (req.user exists)
    if (req.user) {
      const { authCode } = body;
      const isAdmin =
        req.user.role === "administrateur" || req.user.role === "admin";

      // Role Check (Manual since we removed global RolesGuard for this method to allow Secret flow)
      if (
        !["administrateur", "admin", "formateur", "formatrice"].includes(
          req.user.role,
        )
      ) {
        throw new HttpException("Accès refusé", HttpStatus.FORBIDDEN);
      }

      if (authCode) {
        await this.agendaService.exchangeCodeForToken(req.user.id, authCode);
        const result = await this.agendaService.syncUserEvents(req.user.id);
        return {
          message: "Synchronisation de votre compte réussie.",
          info: result,
        };
      } else if (isAdmin) {
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

    // 2. Secret Flow (External App) - user via Body
    else {
      const { userId, calendars, events } = body;
      if (!userId) {
        throw new HttpException(
          "User ID required for external sync.",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Delegate to a service method that handles the raw data sync if needed
      // The BACKEND_INTEGRATION.md implies the external app might send raw data OR just trigger a sync
      // "Appelle directement les backends en parallèle... /api/agendas/sync (Node.js)"
      // And example body: { "userId": "18", "calendars": [...], "events": [...] }

      // If the implementation in AgendaService expects just a sync trigger, we might need to adjust.
      // But for now, let's assume if it sends data, we might want to process it, OR if it just triggers.
      // Given existing methods 'exchangeCodeForToken' and 'syncUserEvents',
      // if the external app ALREADY synced to Firebase/Google, does it send data to us to SAVE?
      // documentation says: "Sauvegarde les données du calendrier Google... puis Appelle les backends"
      // and "Corps de la requête (exemple): { userId, calendars, events }"

      // We need a method in AgendaService to handle this INCOMING data dump.
      // Let's call `agendaService.processExternalSync(userId, calendars, events)` (we might need to create this)
      // OR reuse `syncUserEvents` if the intention is just to trigger our own fetch?
      // Re-reading MD: "3. Sauvegarde dans Firestore... 4. Synchronisation BACKEND... Appelle directement..."
      // It seems it pushes data.

      // For now, let's try to trigger a sync for that user, OR valid if we need to parse.
      // Since I can't see `processExternalSync` in AgendaService (I viewed it earlier, it had sync logic),
      // I will implement a basic handle or call existing.
      // Actually, if Node.js pulls from Google itself, maybe we just ignore the passed body and trigger a pull?
      // "Fetch calendars & events via Google API" -> "Sauvegarde dans Firestore" -> "Sync BACKEND"
      // If Backend also pulls from Google, it needs tokens.
      // If External App sends tokens? No.

      // Safest bet: The external app sends the data it fetched. We should save it.
      // But `AgendaService` likely has logic to pull.
      // Let's see if we can just trigger `syncUserEvents(userId)` which pulls from Google.
      // This assumes Node.js allows reading Google API.

      return await this.agendaService.handleExternalSyncData(
        userId,
        calendars,
        events,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(
    "administrateur",
    "admin",
    "formateur",
    "formatrice",
    "commercial",
    "stagiaire",
  )
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
  @UseGuards(AuthGuard("jwt"), RolesGuard)
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
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(
    "administrateur",
    "admin",
    "formateur",
    "formatrice",
    "commercial",
    "stagiaire",
  )
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
  @UseGuards(AuthGuard("jwt"), RolesGuard)
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
  @UseGuards(AuthGuard("jwt"), RolesGuard)
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
