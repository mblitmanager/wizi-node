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
const mail_module_1 = require("../mail/mail.module");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const admin_dashboard_controller_1 = require("./admin-dashboard.controller");
const formateur_controller_1 = require("./formateur.controller");
const commercial_controller_1 = require("./commercial.controller");
const admin_stagiaire_controller_1 = require("./admin-stagiaire.controller");
const admin_formateur_controller_1 = require("./admin-formateur.controller");
const admin_quiz_controller_1 = require("./admin-quiz.controller");
const admin_formation_controller_1 = require("./admin-formation.controller");
const admin_catalogue_controller_1 = require("./admin-catalogue.controller");
const admin_achievement_controller_1 = require("./admin-achievement.controller");
const admin_settings_controller_1 = require("./admin-settings.controller");
const admin_media_controller_1 = require("./admin-media.controller");
const admin_question_controller_1 = require("./admin-question.controller");
const admin_catalogue_formation_controller_1 = require("./admin-catalogue-formation.controller");
const admin_commercial_controller_1 = require("./admin-commercial.controller");
const admin_prc_controller_1 = require("./admin-prc.controller");
const admin_permission_role_controller_1 = require("./admin-permission-role.controller");
const admin_misc_controller_1 = require("./admin-misc.controller");
const admin_stats_import_controller_1 = require("./admin-stats-import.controller");
const formateur_commercial_web_controller_1 = require("./formateur-commercial-web.controller");
const formateur_commercial_api_controller_1 = require("./formateur-commercial-api.controller");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const user_entity_1 = require("../entities/user.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const achievement_entity_1 = require("../entities/achievement.entity");
const setting_entity_1 = require("../entities/setting.entity");
const media_entity_1 = require("../entities/media.entity");
const question_entity_1 = require("../entities/question.entity");
const formation_entity_1 = require("../entities/formation.entity");
const commercial_entity_1 = require("../entities/commercial.entity");
const pole_relation_client_entity_1 = require("../entities/pole-relation-client.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mail_module_1.MailModule,
            typeorm_1.TypeOrmModule.forFeature([
                stagiaire_entity_1.Stagiaire,
                user_entity_1.User,
                quiz_participation_entity_1.QuizParticipation,
                formateur_entity_1.Formateur,
                catalogue_formation_entity_1.CatalogueFormation,
                quiz_entity_1.Quiz,
                achievement_entity_1.Achievement,
                setting_entity_1.Setting,
                media_entity_1.Media,
                question_entity_1.Question,
                formation_entity_1.Formation,
                commercial_entity_1.Commercial,
                pole_relation_client_entity_1.PoleRelationClient,
            ]),
        ],
        providers: [admin_service_1.AdminService],
        controllers: [
            admin_controller_1.AdminController,
            admin_dashboard_controller_1.AdminDashboardController,
            formateur_controller_1.FormateurController,
            commercial_controller_1.CommercialController,
            admin_stagiaire_controller_1.AdminStagiaireController,
            admin_formateur_controller_1.AdminFormateurController,
            admin_quiz_controller_1.AdminQuizController,
            admin_formation_controller_1.AdminFormationController,
            admin_catalogue_controller_1.AdminCatalogueController,
            admin_achievement_controller_1.AdminAchievementController,
            admin_settings_controller_1.AdminSettingsController,
            admin_media_controller_1.AdminMediaController,
            admin_question_controller_1.AdminQuestionController,
            admin_catalogue_formation_controller_1.AdminCatalogueFormationController,
            admin_commercial_controller_1.AdminCommercialController,
            admin_prc_controller_1.AdminPoleRelationClientController,
            admin_permission_role_controller_1.AdminPermissionController,
            admin_permission_role_controller_1.AdminRoleController,
            admin_misc_controller_1.AdminParametreController,
            admin_misc_controller_1.AdminClassementController,
            admin_misc_controller_1.AdminParrainageController,
            admin_misc_controller_1.AdminPartenaireController,
            admin_misc_controller_1.AdminMediasController,
            admin_stats_import_controller_1.AdminStatsController,
            admin_stats_import_controller_1.AdminImportController,
            admin_stats_import_controller_1.AdminInactivityController,
            formateur_commercial_web_controller_1.FormateurWebController,
            formateur_commercial_web_controller_1.CommercialWebController,
            formateur_commercial_api_controller_1.FormateurApiController,
            formateur_commercial_api_controller_1.CommercialApiController,
        ],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map