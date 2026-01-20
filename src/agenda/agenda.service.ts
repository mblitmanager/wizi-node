import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
import { GoogleCalendar } from "../entities/google-calendar.entity";
import { GoogleCalendarEvent } from "../entities/google-calendar-event.entity";

@Injectable()
export class AgendaService {
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
    private googleCalendarEventRepository: Repository<GoogleCalendarEvent>
  ) {}

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
        `Stagiaire avec l'utilisateur ID ${userId} introuvable`
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
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WiziLearn//NONSGML v1.0//EN\r\n";

    for (const event of events) {
      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `DTSTART:${this.formatDateForICS(event.date_debut)}\r\n`;
      icsContent += `DTEND:${this.formatDateForICS(event.date_fin)}\r\n`;
      icsContent += `SUMMARY:${event.titre}\r\n`;
      icsContent += `DESCRIPTION:${event.description || ""}\r\n`;
      icsContent += "END:VEVENT\r\n";
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

    return this.notificationRepository.find({
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
      { read: true }
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
    events: any[]
  ) {
    let calendarsSyncedCount = 0;
    let eventsSyncedCount = 0;

    for (const calendarData of calendars) {
      let googleCalendar = await this.googleCalendarRepository.findOne({
        where: { googleId: calendarData.googleId, userId: parseInt(userId) },
      });

      if (googleCalendar) {
        // Update existing calendar
        Object.assign(googleCalendar, {
          summary: calendarData.summary,
          description: calendarData.description,
          backgroundColor: calendarData.backgroundColor,
          foregroundColor: calendarData.foregroundColor,
          accessRole: calendarData.accessRole, // Assurez-vous que ce champ est envoyé par le front-end
          timeZone: calendarData.timeZone,     // Assurez-vous que ce champ est envoyé par le front-end
          syncedAt: new Date(),
        });
        await this.googleCalendarRepository.save(googleCalendar);
      } else {
        // Create new calendar
        googleCalendar = this.googleCalendarRepository.create({
          userId: parseInt(userId),
          googleId: calendarData.googleId,
          summary: calendarData.summary,
          description: calendarData.description,
          backgroundColor: calendarData.backgroundColor,
          foregroundColor: calendarData.foregroundColor,
          accessRole: calendarData.accessRole,
          timeZone: calendarData.timeZone,
          syncedAt: new Date(),
        });
        await this.googleCalendarRepository.save(googleCalendar);
      }
      calendarsSyncedCount++;

      // Supprimer tous les événements existants pour ce calendrier et cette date
      await this.googleCalendarEventRepository.delete({
        googleCalendarId: googleCalendar.id,
      });

      for (const eventData of events) {
        if (eventData.calendarId === googleCalendar.googleId) {
          const googleCalendarEvent = this.googleCalendarEventRepository.create({
            googleCalendarId: googleCalendar.id,
            googleId: eventData.googleId,
            summary: eventData.summary,
            description: eventData.description,
            location: eventData.location,
            start: new Date(eventData.start),
            end: new Date(eventData.end),
            htmlLink: eventData.htmlLink,
            hangoutLink: eventData.hangoutLink,
            organizer: eventData.organizer,
            attendees: eventData.attendees,
            status: eventData.status,
            recurrence: eventData.recurrence,
            eventType: eventData.eventType,
          });
          await this.googleCalendarEventRepository.save(googleCalendarEvent);
          eventsSyncedCount++;
        }
      }
    }

    return {
      userId,
      calendarsSynced: calendarsSyncedCount,
      eventsSynced: eventsSyncedCount,
    };
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
