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
exports.CatalogueFormation = void 0;
const typeorm_1 = require("typeorm");
const stagiaire_catalogue_formation_entity_1 = require("./stagiaire-catalogue-formation.entity");
const formation_entity_1 = require("./formation.entity");
let CatalogueFormation = class CatalogueFormation {
};
exports.CatalogueFormation = CatalogueFormation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CatalogueFormation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], CatalogueFormation.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "certification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "prerequis", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "duree", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CatalogueFormation.prototype, "tarif", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CatalogueFormation.prototype, "formation_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => formation_entity_1.Formation, (formation) => formation.catalogue_formations),
    (0, typeorm_1.JoinColumn)({ name: "formation_id" }),
    __metadata("design:type", formation_entity_1.Formation)
], CatalogueFormation.prototype, "formation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "cursus_pdf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "objectifs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "programme", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "modalites", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "modalites_accompagnement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "moyens_pedagogiques", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "modalites_suivi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "evaluation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "lieu", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "niveau", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CatalogueFormation.prototype, "public_cible", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CatalogueFormation.prototype, "nombre_participants", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CatalogueFormation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CatalogueFormation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CatalogueFormation.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation, (scf) => scf.catalogue_formation),
    __metadata("design:type", Array)
], CatalogueFormation.prototype, "stagiaire_catalogue_formations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)("Formateur", (formateur) => formateur.formations),
    (0, typeorm_1.JoinTable)({
        name: "formateur_catalogue_formation",
        joinColumn: { name: "catalogue_formation_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "formateur_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], CatalogueFormation.prototype, "formateurs", void 0);
exports.CatalogueFormation = CatalogueFormation = __decorate([
    (0, typeorm_1.Entity)("catalogue_formations")
], CatalogueFormation);
//# sourceMappingURL=catalogue-formation.entity.js.map