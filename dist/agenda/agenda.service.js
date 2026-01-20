"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agenda_entity_1 = require("../entities/agenda.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const notification_entity_1 = require("../entities/notification.entity");
const google_calendar_entity_1 = require("../entities/google-calendar.entity");
const google_calendar_event_entity_1 = require("../entities/google-calendar-event.entity");
let AgendaService = class AgendaService {
    constructor(agendaRepository, stagiaireRepository, notificationRepository, googleCalendarRepository, googleCalendarEventRepository) {
        this.agendaRepository = agendaRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.notificationRepository = notificationRepository;
        this.googleCalendarRepository = googleCalendarRepository;
        this.googleCalendarEventRepository = googleCalendarEventRepository;
    }
    async getStagiaireAgenda(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: [
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire avec l'utilisateur ID ${userId} introuvable`);
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
    async exportAgendaToICS(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire introuvable`);
        }
        const events = await this.agendaRepository.find({
            where: { stagiaire_id: stagiaire.id },
        });
        let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WiziLearn//NONSGML v1.0//EN\r\n";
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
    async getStagiaireNotifications(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire introuvable`);
        }
        return this.notificationRepository.find({
            where: { user_id: userId },
            order: { created_at: "DESC" },
        });
    }
    async markNotificationAsRead(notificationId) {
        const result = await this.notificationRepository.update(notificationId, {
            read: true,
        });
        return (result.affected ?? 0) > 0;
    }
    async markAllNotificationsAsRead(userId) {
        const result = await this.notificationRepository.update({ user_id: userId, read: false }, { read: true });
        return (result.affected ?? 0) > 0;
    }
    formatDateForICS(date) {
        if (!date)
            return "";
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }
    async syncGoogleCalendarData(userId, calendars, events) {
        let calendarsSyncedCount = 0;
        let eventsSyncedCount = 0;
        for (const calendarData of calendars) {
            let googleCalendar = await this.googleCalendarRepository.findOne({
                where: { googleId: calendarData.googleId, userId: parseInt(userId) },
            });
            if (googleCalendar) {
                Object.assign(googleCalendar, {
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
            else {
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
    formatAgendaJsonLd(agenda) {
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
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agenda_entity_1.Agenda)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(3, (0, typeorm_1.InjectRepository)(google_calendar_entity_1.GoogleCalendar)),
    __param(4, (0, typeorm_1.InjectRepository)(google_calendar_event_entity_1.GoogleCalendarEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map