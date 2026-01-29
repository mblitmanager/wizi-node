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
const formateur_entity_1 = require("../entities/formateur.entity");
const user_entity_1 = require("../entities/user.entity");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
let AgendaService = class AgendaService {
    constructor(agendaRepository, stagiaireRepository, notificationRepository, googleCalendarRepository, googleCalendarEventRepository, formateurRepository, userRepository, configService) {
        this.agendaRepository = agendaRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.notificationRepository = notificationRepository;
        this.googleCalendarRepository = googleCalendarRepository;
        this.googleCalendarEventRepository = googleCalendarEventRepository;
        this.formateurRepository = formateurRepository;
        this.userRepository = userRepository;
        this.configService = configService;
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(this.configService.get("GOOGLE_CLIENT_ID"), this.configService.get("GOOGLE_CLIENT_SECRET"), this.configService.get("GOOGLE_REDIRECT_URI"));
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
    async getFormateurAgenda(userId) {
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
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wizi Learn//Agenda//FR\n";
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
    async getStagiaireNotifications(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire introuvable`);
        }
        return await this.notificationRepository.find({
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
        if (!userId) {
            throw new Error("userId is required for sync");
        }
        const numericUserId = typeof userId === "number" ? userId : parseInt(userId.toString());
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
            }
            else {
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
                    const googleCalendarEvent = this.googleCalendarEventRepository.create({
                        google_calendar_id: googleCalendar.id,
                        google_id: eventData.googleId || eventData.id,
                        summary: eventData.summary || eventData.titre || "Sans titre",
                        description: eventData.description,
                        location: eventData.location,
                        start: new Date(eventData.start || eventData.date_debut),
                        end: new Date(eventData.end || eventData.date_fin),
                        htmlLink: eventData.htmlLink,
                        hangoutLink: eventData.hangoutLink,
                        organizer: typeof eventData.organizer === "object"
                            ? eventData.organizer.email
                            : eventData.organizer,
                        attendees: Array.isArray(eventData.attendees)
                            ? eventData.attendees.map((a) => typeof a === "object" ? a.email : a)
                            : null,
                        status: eventData.status,
                    });
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
    async exchangeCodeForToken(userId, code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        if (tokens.refresh_token) {
            await this.userRepository.update(userId, {
                google_refresh_token: tokens.refresh_token,
            });
            return tokens.refresh_token;
        }
        return tokens.access_token;
    }
    async syncUserEvents(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.google_refresh_token) {
            throw new Error(`Utilisateur ${userId} n'a pas de compte Google connecté`);
        }
        this.oauth2Client.setCredentials({
            refresh_token: user.google_refresh_token,
        });
        const calendarApi = googleapis_1.google.calendar({
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
        return await this.syncGoogleCalendarData(userId.toString(), calendars, allEvents);
    }
    async syncAllUsers() {
        const users = await this.userRepository.find({
            where: { google_refresh_token: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
        });
        const results = [];
        for (const user of users) {
            try {
                const res = await this.syncUserEvents(user.id);
                results.push({ userId: user.id, status: "success", info: res });
            }
            catch (error) {
                results.push({
                    userId: user.id,
                    status: "error",
                    message: error.message,
                });
            }
        }
        return results;
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
    __param(5, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map