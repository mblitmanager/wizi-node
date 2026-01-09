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
exports.Formateur = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Formateur = class Formateur {
};
exports.Formateur = Formateur;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Formateur.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Formateur.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Formateur.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Formateur.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Formateur.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)("Stagiaire", (stagiaire) => stagiaire.formateurs),
    (0, typeorm_1.JoinTable)({
        name: "formateur_stagiaire",
        joinColumn: { name: "formateur_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Formateur.prototype, "stagiaires", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)("CatalogueFormation", (catalogue) => catalogue.formateurs),
    (0, typeorm_1.JoinTable)({
        name: "formateur_catalogue_formation",
        joinColumn: { name: "formateur_id", referencedColumnName: "id" },
        inverseJoinColumn: {
            name: "catalogue_formation_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Formateur.prototype, "formations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Formateur.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Formateur.prototype, "updated_at", void 0);
exports.Formateur = Formateur = __decorate([
    (0, typeorm_1.Entity)("formateurs")
], Formateur);
//# sourceMappingURL=formateur.entity.js.map