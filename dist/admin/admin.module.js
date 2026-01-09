"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const formateur_controller_1 = require("./formateur.controller");
const commercial_controller_1 = require("./commercial.controller");
const admin_stagiaire_controller_1 = require("./admin-stagiaire.controller");
const admin_formateur_controller_1 = require("./admin-formateur.controller");
const admin_quiz_controller_1 = require("./admin-quiz.controller");
const admin_formation_controller_1 = require("./admin-formation.controller");
const admin_catalogue_controller_1 = require("./admin-catalogue.controller");
const admin_achievement_controller_1 = require("./admin-achievement.controller");
const admin_settings_controller_1 = require("./admin-settings.controller");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const user_entity_1 = require("../entities/user.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const achievement_entity_1 = require("../entities/achievement.entity");
const setting_entity_1 = require("../entities/setting.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                stagiaire_entity_1.Stagiaire,
                user_entity_1.User,
                quiz_participation_entity_1.QuizParticipation,
                formateur_entity_1.Formateur,
                catalogue_formation_entity_1.CatalogueFormation,
                quiz_entity_1.Quiz,
                achievement_entity_1.Achievement,
                setting_entity_1.Setting,
            ]),
        ],
        providers: [admin_service_1.AdminService],
        controllers: [
            admin_controller_1.AdminController,
            formateur_controller_1.FormateurController,
            commercial_controller_1.CommercialController,
            admin_stagiaire_controller_1.AdminStagiaireController,
            admin_formateur_controller_1.AdminFormateurController,
            admin_quiz_controller_1.AdminQuizController,
            admin_formation_controller_1.AdminFormationController,
            admin_catalogue_controller_1.AdminCatalogueController,
            admin_achievement_controller_1.AdminAchievementController,
            admin_settings_controller_1.AdminSettingsController,
        ],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map