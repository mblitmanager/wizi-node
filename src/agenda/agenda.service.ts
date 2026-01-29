import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual, Not, IsNull } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
import { GoogleCalendar } from "../entities/google-calendar.entity";
import { GoogleCalendarEvent } from "../entities/google-calendar-event.entity";
import { Formateur } from "../entities/formateur.entity";
import { User } from "../entities/user.entity";
import { google } from "googleapis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AgendaService {
  private oauth2Client;

  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(GoogleCalendar)
    private googleCalendarRepository: Repository<GoogleCalendar>,
    @InjectRepository(GoogleCalendarEvent)
    private googleCalendarEventRepository: Repository<GoogleCalendarEvent>,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get("GOOGLE_CLIENT_ID"),
      this.configService.get("GOOGLE_CLIENT_SECRET"),
      this.configService.get("GOOGLE_REDIRECT_URI"),
    );
  }

  async getStagiaireAgenda(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException(
        `Stagiaire avec l'utilisateur ID ${userId} introuvable`,
      );
    }

    const formations = (stagiaire.stagiaire_catalogue_formations || [])
      .map((scf) => scf.catalogue_formation?.formation)
      .filter((f) => !!f);

    const events = await this.agendaRepository.find({
      where: { stagiaire_id: stagiaire.id },
      order: { date_debut: "ASC" },
    });

    const now = new Date();
    const upcoming_events = events.filter((e) => e.date_debut >= now);

    return {
      formations,
      events,
      upcoming_events,
    };
  }

  async getFormateurAgenda(userId: number) {
    const googleCalendars = await this.googleCalendarRepository.find({
      where: { user_id: userId },
    });

    const googleCalendarEvents = [];
    for (const calendar of googleCalendars) {
      const events = await this.googleCalendarEventRepository.find({
        where: { google_calendar_id: calendar.id },
        order: { start: "ASC" },
      });
      googleCalendarEvents.push(...events);
    }

    return {
      agendaEvents: [],
      googleCalendarEvents,
    };
  }

  async exportAgendaToICS(userId: number): Promise<string> {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire introuvable`);
    }

    const events = await this.agendaRepository.find({
      where: { stagiaire_id: stagiaire.id },
    });

    let icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wizi Learn//Agenda//FR\n";

    for (const event of events) {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.titre}\n`;
      icsContent += `DESCRIPTION:${event.description || ""}\n`;
      icsContent += `DTSTART:${this.formatDateForICS(event.date_debut)}\n`;
      icsContent += `DTEND:${this.formatDateForICS(event.date_fin)}\n`;
      icsContent += "END:VEVENT\n";
    }

    icsContent += "END:VCALENDAR";
    return icsContent;
  }

  async getStagiaireNotifications(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire introuvable`);
    }

    return await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
    });
  }

  async markNotificationAsRead(notificationId: number): Promise<boolean> {
    const result = await this.notificationRepository.update(notificationId, {
      read: true,
    });
    return (result.affected ?? 0) > 0;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const result = await this.notificationRepository.update(
      { user_id: userId, read: false },
      { read: true },
    );
    return (result.affected ?? 0) > 0;
  }

  private formatDateForICS(date: Date): string {
    if (!date) return "";
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  async syncGoogleCalendarData(
    userId: string,
    calendars: any[],
    events: any[],
  ) {
    if (!userId) {
      throw new Error("userId is required for sync");
    }

    const numericUserId =
      typeof userId === "number" ? userId : parseInt(userId.toString());

    let calendarsSyncedCount = 0;
    let eventsSyncedCount = 0;

    for (const calendarData of calendars) {
      let googleCalendar = await this.googleCalendarRepository.findOne({
        where: {
          google_id: calendarData.googleId || calendarData.id,
          user_id: numericUserId,
        },
      });

      if (!googleCalendar) {
        googleCalendar = this.googleCalendarRepository.create({
          user_id: numericUserId,
          google_id: calendarData.googleId || calendarData.id,
          summary: calendarData.summary,
          description: calendarData.description,
          backgroundColor: calendarData.backgroundColor,
          foregroundColor: calendarData.foregroundColor,
          accessRole: calendarData.accessRole,
          timeZone: calendarData.timeZone,
          syncedAt: new Date(),
        });
      } else {
        googleCalendar.summary = calendarData.summary;
        googleCalendar.description = calendarData.description;
        googleCalendar.backgroundColor = calendarData.backgroundColor;
        googleCalendar.foregroundColor = calendarData.foregroundColor;
        googleCalendar.accessRole = calendarData.accessRole;
        googleCalendar.timeZone = calendarData.timeZone;
        googleCalendar.syncedAt = new Date();
      }

      await this.googleCalendarRepository.save(googleCalendar);
      calendarsSyncedCount++;

      await this.googleCalendarEventRepository.delete({
        google_calendar_id: googleCalendar.id,
      });

      for (const eventData of events) {
        if (eventData.calendarId === googleCalendar.google_id) {
          const googleCalendarEvent = this.googleCalendarEventRepository.create(
            {
              google_calendar_id: googleCalendar.id,
              google_id: eventData.googleId || eventData.id,
              summary: eventData.summary || eventData.titre || "Sans titre",
              description: eventData.description,
              location: eventData.location,
              start: new Date(eventData.start || eventData.date_debut),
              end: new Date(eventData.end || eventData.date_fin),
              htmlLink: eventData.htmlLink,
              hangoutLink: eventData.hangoutLink,
              organizer:
                typeof eventData.organizer === "object"
                  ? eventData.organizer.email
                  : eventData.organizer,
              attendees: Array.isArray(eventData.attendees)
                ? eventData.attendees.map((a) =>
                    typeof a === "object" ? a.email : a,
                  )
                : null,
              status: eventData.status,
            },
          );
          await this.googleCalendarEventRepository.save(googleCalendarEvent);
          eventsSyncedCount++;
        }
      }
    }

    return {
      calendarsSynced: calendarsSyncedCount,
      eventsSynced: eventsSyncedCount,
    };
  }

  async exchangeCodeForToken(userId: number, code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    if (tokens.refresh_token) {
      await this.userRepository.update(userId, {
        google_refresh_token: tokens.refresh_token,
      });
      return tokens.refresh_token;
    }
    return tokens.access_token;
  }

  async syncUserEvents(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.google_refresh_token) {
      throw new Error(
        `Utilisateur ${userId} n'a pas de compte Google connecté`,
      );
    }

    this.oauth2Client.setCredentials({
      refresh_token: user.google_refresh_token,
    });

    const calendarApi = google.calendar({
      version: "v3",
      auth: this.oauth2Client,
    });
    const calendarList = await calendarApi.calendarList.list();
    const calendars = calendarList.data.items || [];

    const allEvents = [];
    for (const cal of calendars) {
      const resp = await calendarApi.events.list({
        calendarId: cal.id,
        timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        timeMax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });
      const events = (resp.data.items || []).map((e) => ({
        ...e,
        calendarId: cal.id,
      }));
      allEvents.push(...events);
    }

    return await this.syncGoogleCalendarData(
      userId.toString(),
      calendars as any[],
      allEvents as any[],
    );
  }

  async syncAllUsers() {
    const users = await this.userRepository.find({
      where: { google_refresh_token: Not(IsNull()) },
    });

    const results = [];
    for (const user of users) {
      try {
        const res = await this.syncUserEvents(user.id);
        results.push({ userId: user.id, status: "success", info: res });
      } catch (error) {
        results.push({
          userId: user.id,
          status: "error",
          message: error.message,
        });
      }
    }
    return results;
  }

  formatAgendaJsonLd(agenda: Agenda) {
    return {
      "@context": "/api/contexts/Agenda",
      "@id": `/api/agendas/${agenda.id}`,
      "@type": "Agenda",
      id: agenda.id,
      titre: agenda.titre,
      description: agenda.description,
      date_debut: agenda.date_debut?.toISOString(),
      date_fin: agenda.date_fin?.toISOString(),
      evenement: agenda.evenement,
      commentaire: agenda.commentaire,
      stagiaire: agenda.stagiaire_id
        ? `/api/stagiaires/${agenda.stagiaire_id}`
        : null,
      created_at: agenda.created_at?.toISOString(),
      updated_at: agenda.updated_at?.toISOString(),
    };
  }
}
