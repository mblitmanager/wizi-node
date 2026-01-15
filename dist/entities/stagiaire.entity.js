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
const media_entity_1 = require("./media.entity");
const achievement_entity_1 = require("./achievement.entity");
const partenaire_entity_1 = require("./partenaire.entity");
const agenda_entity_1 = require("./agenda.entity");
const progression_entity_1 = require("./progression.entity");
const stagiaire_catalogue_formation_entity_1 = require("./stagiaire-catalogue-formation.entity");
const commercial_entity_1 = require("./commercial.entity");
const pole_relation_client_entity_1 = require("./pole-relation-client.entity");
const classement_entity_1 = require("./classement.entity");
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
    __metadata("design:type", Object)
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
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Stagiaire.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation, (scf) => scf.stagiaire),
    __metadata("design:type", Array)
], Stagiaire.prototype, "stagiaire_catalogue_formations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => media_entity_1.Media, (media) => media.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "media_stagiaire",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "media_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "medias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => progression_entity_1.Progression, (progression) => progression.stagiaire),
    __metadata("design:type", Array)
], Stagiaire.prototype, "progressions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)("Formateur", (formateur) => formateur.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "formateur_stagiaire",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "formateur_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "formateurs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => commercial_entity_1.Commercial, (commercial) => commercial.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "commercial_stagiaire",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "commercial_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "commercials", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => pole_relation_client_entity_1.PoleRelationClient, (pole) => pole.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "pole_relation_client_stagiaire",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: {
            name: "pole_relation_client_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "poleRelationClients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => classement_entity_1.Classement, (classement) => classement.stagiaire),
    __metadata("design:type", Array)
], Stagiaire.prototype, "classements", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => achievement_entity_1.Achievement, (achievement) => achievement.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "stagiaire_achievements",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "achievement_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => partenaire_entity_1.Partenaire, (partenaire) => partenaire.stagiaires),
    (0, typeorm_1.JoinTable)({
        name: "partenaire_stagiaire",
        joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "partenaire_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Stagiaire.prototype, "partenaires", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agenda_entity_1.Agenda, (agenda) => agenda.stagiaire),
    __metadata("design:type", Array)
], Stagiaire.prototype, "agendas", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Stagiaire.prototype, "partenaire_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => partenaire_entity_1.Partenaire),
    (0, typeorm_1.JoinColumn)({ name: "partenaire_id" }),
    __metadata("design:type", partenaire_entity_1.Partenaire)
], Stagiaire.prototype, "partenaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "last_login_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stagiaire.prototype, "login_streak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Stagiaire.prototype, "deleted_at", void 0);
exports.Stagiaire = Stagiaire = __decorate([
    (0, typeorm_1.Entity)("stagiaires")
], Stagiaire);
//# sourceMappingURL=stagiaire.entity.js.map