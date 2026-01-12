"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StagiaireModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_module_1 = require("../common/common.module");
const api_response_service_1 = require("../common/services/api-response.service");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const stagiaire_achievement_entity_1 = require("../entities/stagiaire-achievement.entity");
const stagiaire_service_1 = require("./stagiaire.service");
const stagiaire_controller_1 = require("./stagiaire.controller");
const stagiaires_controller_1 = require("./stagiaires.controller");
const stagiaire_api_controller_1 = require("./stagiaire-api.controller");
const classement_entity_1 = require("../entities/classement.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const formation_entity_1 = require("../entities/formation.entity");
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const inscription_module_1 = require("../inscription/inscription.module");
const ranking_module_1 = require("../ranking/ranking.module");
const agenda_module_1 = require("../agenda/agenda.module");
const media_module_1 = require("../media/media.module");
const user_entity_1 = require("../entities/user.entity");
let StagiaireModule = class StagiaireModule {
};
exports.StagiaireModule = StagiaireModule;
exports.StagiaireModule = StagiaireModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forFeature([
                stagiaire_entity_1.Stagiaire,
                stagiaire_achievement_entity_1.StagiaireAchievement,
                classement_entity_1.Classement,
                catalogue_formation_entity_1.CatalogueFormation,
                formation_entity_1.Formation,
                quiz_entity_1.Quiz,
                quiz_participation_entity_1.QuizParticipation,
                stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation,
                user_entity_1.User,
            ]),
            inscription_module_1.InscriptionModule,
            ranking_module_1.RankingModule,
            agenda_module_1.AgendaModule,
            media_module_1.MediaModule,
        ],
        providers: [stagiaire_service_1.StagiaireService, api_response_service_1.ApiResponseService],
        controllers: [
            stagiaire_controller_1.StagiaireController,
            stagiaires_controller_1.StagiairesController,
            stagiaire_api_controller_1.StagiaireApiController,
            stagiaire_api_controller_1.ApiGeneralController,
        ],
        exports: [stagiaire_service_1.StagiaireService],
    })
], StagiaireModule);
//# sourceMappingURL=stagiaire.module.js.map