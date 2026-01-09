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
exports.Stagiaire = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const catalogue_formation_entity_1 = require("./catalogue-formation.entity");
let Stagiaire = class Stagiaire {
};
exports.Stagiaire = Stagiaire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stagiaire.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "civilite", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "date_naissance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "ville", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "code_postal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "date_debut_formation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "date_inscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stagiaire.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Stagiaire.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "date_fin_formation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Stagiaire.prototype, "onboarding_seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Stagiaire.prototype, "partenaire_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Stagiaire.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => catalogue_formation_entity_1.CatalogueFormation, (catalogue) => catalogue.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "stagiaire_catalogue_formations",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: {
            name: "catalogue_formation_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "catalogue_formations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "updated_at", void 0);
exports.Stagiaire = Stagiaire = __decorate([
    (0, typeorm_1.Entity)("stagiaires")
], Stagiaire);
//# sourceMappingURL=stagiaire.entity.js.map