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
exports.StagiaireCatalogueFormation = void 0;
const typeorm_1 = require("typeorm");
const stagiaire_entity_1 = require("./stagiaire.entity");
const catalogue_formation_entity_1 = require("./catalogue-formation.entity");
let StagiaireCatalogueFormation = class StagiaireCatalogueFormation {
};
exports.StagiaireCatalogueFormation = StagiaireCatalogueFormation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StagiaireCatalogueFormation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stagiaire_id" }),
    __metadata("design:type", Number)
], StagiaireCatalogueFormation.prototype, "stagiaire_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "catalogue_formation_id" }),
    __metadata("design:type", Number)
], StagiaireCatalogueFormation.prototype, "catalogue_formation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], StagiaireCatalogueFormation.prototype, "date_debut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], StagiaireCatalogueFormation.prototype, "date_inscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], StagiaireCatalogueFormation.prototype, "date_fin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], StagiaireCatalogueFormation.prototype, "formateur_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stagiaire_entity_1.Stagiaire, (stagiaire) => stagiaire.stagiaire_catalogue_formations),
    (0, typeorm_1.JoinColumn)({ name: "stagiaire_id" }),
    __metadata("design:type", stagiaire_entity_1.Stagiaire)
], StagiaireCatalogueFormation.prototype, "stagiaire", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalogue_formation_entity_1.CatalogueFormation, (catalogue) => catalogue.stagiaire_catalogue_formations),
    (0, typeorm_1.JoinColumn)({ name: "catalogue_formation_id" }),
    __metadata("design:type", catalogue_formation_entity_1.CatalogueFormation)
], StagiaireCatalogueFormation.prototype, "catalogue_formation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StagiaireCatalogueFormation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StagiaireCatalogueFormation.prototype, "updated_at", void 0);
exports.StagiaireCatalogueFormation = StagiaireCatalogueFormation = __decorate([
    (0, typeorm_1.Entity)("stagiaire_catalogue_formations")
], StagiaireCatalogueFormation);
//# sourceMappingURL=stagiaire-catalogue-formation.entity.js.map