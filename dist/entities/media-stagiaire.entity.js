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
exports.MediaStagiaire = void 0;
const typeorm_1 = require("typeorm");
const media_entity_1 = require("./media.entity");
const stagiaire_entity_1 = require("./stagiaire.entity");
let MediaStagiaire = class MediaStagiaire {
};
exports.MediaStagiaire = MediaStagiaire;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], MediaStagiaire.prototype, "media_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], MediaStagiaire.prototype, "stagiaire_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MediaStagiaire.prototype, "is_watched", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], MediaStagiaire.prototype, "watched_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MediaStagiaire.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0, select: false }),
    __metadata("design:type", Number)
], MediaStagiaire.prototype, "current_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0, select: false }),
    __metadata("design:type", Number)
], MediaStagiaire.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", default: 0 }),
    __metadata("design:type", Number)
], MediaStagiaire.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MediaStagiaire.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_entity_1.Media),
    (0, typeorm_1.JoinColumn)({ name: "media_id" }),
    __metadata("design:type", media_entity_1.Media)
], MediaStagiaire.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stagiaire_entity_1.Stagiaire),
    (0, typeorm_1.JoinColumn)({ name: "stagiaire_id" }),
    __metadata("design:type", stagiaire_entity_1.Stagiaire)
], MediaStagiaire.prototype, "stagiaire", void 0);
exports.MediaStagiaire = MediaStagiaire = __decorate([
    (0, typeorm_1.Entity)("media_stagiaire")
], MediaStagiaire);
//# sourceMappingURL=media-stagiaire.entity.js.map