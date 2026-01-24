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
const notification_module_1 = require("../notification/notification.module");
const common_module_1 = require("../common/common.module");
const api_response_service_1 = require("../common/services/api-response.service");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const admin_dashboard_controller_1 = require("./admin-dashboard.controller");
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
const admin_data_reset_controller_1 = require("./admin-data-reset.controller");
const admin_demande_historique_controller_1 = require("./admin-demande-historique.controller");
const admin_parrainage_event_controller_1 = require("./admin-parrainage-event.controller");
const admin_catalogue_formation_controller_1 = require("./admin-catalogue-formation.controller");
const admin_commercial_controller_1 = require("./admin-commercial.controller");
const admin_prc_controller_1 = require("./admin-prc.controller");
const admin_permission_role_controller_1 = require("./admin-permission-role.controller");
const admin_misc_controller_1 = require("./admin-misc.controller");
const admin_stats_import_controller_1 = require("./admin-stats-import.controller");
const formateur_controller_1 = require("./formateur.controller");
const formateur_commercial_web_controller_1 = require("./formateur-commercial-web.controller");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const user_entity_1 = require("../entities/user.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const quiz_participation_answer_entity_1 = require("../entities/quiz-participation-answer.entity");
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
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const partenaire_entity_1 = require("../entities/partenaire.entity");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const parrainage_entity_1 = require("../entities/parrainage.entity");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const classement_entity_1 = require("../entities/classement.entity");
const progression_entity_1 = require("../entities/progression.entity");
const stagiaire_achievement_entity_1 = require("../entities/stagiaire-achievement.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
const media_stagiaire_entity_1 = require("../entities/media-stagiaire.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mail_module_1.MailModule,
            notification_module_1.NotificationModule,
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forFeature([
                stagiaire_entity_1.Stagiaire,
                user_entity_1.User,
                quiz_participation_entity_1.QuizParticipation,
                quiz_participation_answer_entity_1.QuizParticipationAnswer,
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
                stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation,
                partenaire_entity_1.Partenaire,
                demande_inscription_entity_1.DemandeInscription,
                parrainage_entity_1.Parrainage,
                parrainage_event_entity_1.ParrainageEvent,
                classement_entity_1.Classement,
                progression_entity_1.Progression,
                stagiaire_achievement_entity_1.StagiaireAchievement,
                reponse_entity_1.Reponse,
                media_stagiaire_entity_1.MediaStagiaire,
            ]),
        ],
        providers: [admin_service_1.AdminService, api_response_service_1.ApiResponseService],
        controllers: [
            formateur_controller_1.FormateurController,
            formateur_commercial_web_controller_1.CommercialWebController,
            admin_controller_1.AdminController,
            admin_dashboard_controller_1.AdminDashboardController,
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
            admin_data_reset_controller_1.AdminDataResetController,
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
            admin_demande_historique_controller_1.AdminDemandeHistoriqueController,
            admin_parrainage_event_controller_1.AdminParrainageEventController,
        ],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map