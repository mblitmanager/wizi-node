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
exports.Classement = void 0;
const typeorm_1 = require("typeorm");
const stagiaire_entity_1 = require("./stagiaire.entity");
const quiz_entity_1 = require("./quiz.entity");
let Classement = class Classement {
};
exports.Classement = Classement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Classement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Classement.prototype, "rang", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Classement.prototype, "stagiaire_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stagiaire_entity_1.Stagiaire),
    (0, typeorm_1.JoinColumn)({ name: "stagiaire_id" }),
    __metadata("design:type", stagiaire_entity_1.Stagiaire)
], Classement.prototype, "stagiaire", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Classement.prototype, "quiz_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.Quiz),
    (0, typeorm_1.JoinColumn)({ name: "quiz_id" }),
    __metadata("design:type", quiz_entity_1.Quiz)
], Classement.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Classement.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Classement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Classement.prototype, "updated_at", void 0);
exports.Classement = Classement = __decorate([
    (0, typeorm_1.Entity)("classements")
], Classement);
//# sourceMappingURL=classement.entity.js.map