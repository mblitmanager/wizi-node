"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inscription_service_1 = require("./inscription.service");
const inscription_controller_1 = require("./inscription.controller");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const notification_module_1 = require("../notification/notification.module");
const mail_module_1 = require("../mail/mail.module");
let InscriptionModule = class InscriptionModule {
};
exports.InscriptionModule = InscriptionModule;
exports.InscriptionModule = InscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                demande_inscription_entity_1.DemandeInscription,
                stagiaire_entity_1.Stagiaire,
                catalogue_formation_entity_1.CatalogueFormation,
            ]),
            notification_module_1.NotificationModule,
            mail_module_1.MailModule,
        ],
        providers: [inscription_service_1.InscriptionService],
        controllers: [inscription_controller_1.InscriptionController],
        exports: [inscription_service_1.InscriptionService],
    })
], InscriptionModule);
//# sourceMappingURL=inscription.module.js.map