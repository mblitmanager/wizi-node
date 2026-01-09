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
exports.DemandeInscription = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const catalogue_formation_entity_1 = require("./catalogue-formation.entity");
let DemandeInscription = class DemandeInscription {
};
exports.DemandeInscription = DemandeInscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DemandeInscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], DemandeInscription.prototype, "parrain_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "parrain_id" }),
    __metadata("design:type", user_entity_1.User)
], DemandeInscription.prototype, "parrain", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DemandeInscription.prototype, "filleul_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "filleul_id" }),
    __metadata("design:type", user_entity_1.User)
], DemandeInscription.prototype, "filleul", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DemandeInscription.prototype, "formation_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalogue_formation_entity_1.CatalogueFormation),
    (0, typeorm_1.JoinColumn)({ name: "formation_id" }),
    __metadata("design:type", catalogue_formation_entity_1.CatalogueFormation)
], DemandeInscription.prototype, "formation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "en_attente" }),
    __metadata("design:type", String)
], DemandeInscription.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], DemandeInscription.prototype, "donnees_formulaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DemandeInscription.prototype, "lien_parrainage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DemandeInscription.prototype, "motif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], DemandeInscription.prototype, "date_demande", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], DemandeInscription.prototype, "date_inscription", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DemandeInscription.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DemandeInscription.prototype, "updated_at", void 0);
exports.DemandeInscription = DemandeInscription = __decorate([
    (0, typeorm_1.Entity)("demande_inscriptions")
], DemandeInscription);
//# sourceMappingURL=demande-inscription.entity.js.map