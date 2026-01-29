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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarEvent = void 0;
const typeorm_1 = require("typeorm");
const google_calendar_entity_1 = require("./google-calendar.entity");
let GoogleCalendarEvent = class GoogleCalendarEvent {
};
exports.GoogleCalendarEvent = GoogleCalendarEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GoogleCalendarEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        nullable: false,
    }),
    __metadata("design:type", Number)
], GoogleCalendarEvent.prototype, "google_calendar_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: false,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "google_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        nullable: false,
    }),
    __metadata("design:type", Date)
], GoogleCalendarEvent.prototype, "start", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        nullable: false,
    }),
    __metadata("design:type", Date)
], GoogleCalendarEvent.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "html_link",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "htmlLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "hangout_link",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "hangoutLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "json",
        nullable: true,
    }),
    __metadata("design:type", Object)
], GoogleCalendarEvent.prototype, "organizer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "json",
        nullable: true,
    }),
    __metadata("design:type", Array)
], GoogleCalendarEvent.prototype, "attendees", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "json",
        nullable: true,
    }),
    __metadata("design:type", Object)
], GoogleCalendarEvent.prototype, "recurrence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "event_type",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendarEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], GoogleCalendarEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], GoogleCalendarEvent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => google_calendar_entity_1.GoogleCalendar, (googleCalendar) => googleCalendar.events),
    __metadata("design:type", google_calendar_entity_1.GoogleCalendar)
], GoogleCalendarEvent.prototype, "googleCalendar", void 0);
exports.GoogleCalendarEvent = GoogleCalendarEvent = __decorate([
    (0, typeorm_1.Entity)("google_calendar_events"),
    (0, typeorm_1.Index)(["google_id", "google_calendar_id"], { unique: true })
], GoogleCalendarEvent);
//# sourceMappingURL=google-calendar-event.entity.js.map