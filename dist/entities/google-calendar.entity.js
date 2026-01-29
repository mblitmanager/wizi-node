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
exports.GoogleCalendar = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const google_calendar_event_entity_1 = require("./google-calendar-event.entity");
let GoogleCalendar = class GoogleCalendar {
};
exports.GoogleCalendar = GoogleCalendar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GoogleCalendar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        nullable: false,
    }),
    __metadata("design:type", Number)
], GoogleCalendar.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "google_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: false,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "background_color",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "backgroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "foreground_color",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "foregroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "access_role",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "accessRole", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "time_zone",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GoogleCalendar.prototype, "timeZone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "synced_at",
        type: "timestamp",
        nullable: true,
    }),
    __metadata("design:type", Date)
], GoogleCalendar.prototype, "syncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], GoogleCalendar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], GoogleCalendar.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.googleCalendars),
    __metadata("design:type", user_entity_1.User)
], GoogleCalendar.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => google_calendar_event_entity_1.GoogleCalendarEvent, (event) => event.googleCalendar),
    __metadata("design:type", Array)
], GoogleCalendar.prototype, "events", void 0);
exports.GoogleCalendar = GoogleCalendar = __decorate([
    (0, typeorm_1.Entity)("google_calendars"),
    (0, typeorm_1.Index)(["google_id", "user_id"], { unique: true })
], GoogleCalendar);
//# sourceMappingURL=google-calendar.entity.js.map