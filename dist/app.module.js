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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const user_entity_1 = require("./entities/user.entity");
const stagiaire_entity_1 = require("./entities/stagiaire.entity");
const formation_entity_1 = require("./entities/formation.entity");
const catalogue_formation_entity_1 = require("./entities/catalogue-formation.entity");
const quiz_entity_1 = require("./entities/quiz.entity");
const question_entity_1 = require("./entities/question.entity");
const reponse_entity_1 = require("./entities/reponse.entity");
const auth_module_1 = require("./auth/auth.module");
const stagiaire_module_1 = require("./stagiaire/stagiaire.module");
const formation_module_1 = require("./formation/formation.module");
const quiz_module_1 = require("./quiz/quiz.module");
const media_entity_1 = require("./entities/media.entity");
const progression_entity_1 = require("./entities/progression.entity");
const quiz_participation_entity_1 = require("./entities/quiz-participation.entity");
const quiz_participation_answer_entity_1 = require("./entities/quiz-participation-answer.entity");
const classement_entity_1 = require("./entities/classement.entity");
const formateur_entity_1 = require("./entities/formateur.entity");
const commercial_entity_1 = require("./entities/commercial.entity");
const pole_relation_client_entity_1 = require("./entities/pole-relation-client.entity");
const notification_entity_1 = require("./entities/notification.entity");
const demande_inscription_entity_1 = require("./entities/demande-inscription.entity");
const achievement_entity_1 = require("./entities/achievement.entity");
const parrainage_entity_1 = require("./entities/parrainage.entity");
const parrainage_token_entity_1 = require("./entities/parrainage-token.entity");
const parrainage_event_entity_1 = require("./entities/parrainage-event.entity");
const stagiaire_catalogue_formation_entity_1 = require("./entities/stagiaire-catalogue-formation.entity");
const media_stagiaire_entity_1 = require("./entities/media-stagiaire.entity");
const stagiaire_achievement_entity_1 = require("./entities/stagiaire-achievement.entity");
const correspondance_pair_entity_1 = require("./entities/correspondance-pair.entity");
const partenaire_entity_1 = require("./entities/partenaire.entity");
const agenda_entity_1 = require("./entities/agenda.entity");
const announcement_entity_1 = require("./entities/announcement.entity");
const challenge_entity_1 = require("./entities/challenge.entity");
const ranking_module_1 = require("./ranking/ranking.module");
const notification_module_1 = require("./notification/notification.module");
const inscription_module_1 = require("./inscription/inscription.module");
const achievement_module_1 = require("./achievement/achievement.module");
const parrainage_module_1 = require("./parrainage/parrainage.module");
const catalogue_formation_module_1 = require("./catalogue-formation/catalogue-formation.module");
const admin_module_1 = require("./admin/admin.module");
const media_module_1 = require("./media/media.module");
const mail_module_1 = require("./mail/mail.module");
const agenda_module_1 = require("./agenda/agenda.module");
const announcement_module_1 = require("./announcement/announcement.module");
const challenge_module_1 = require("./challenge/challenge.module");
let AppModule = class AppModule {
    constructor() {
        console.log("AppModule loaded - MediaModule should be active");
    }
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mail_module_1.MailModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: "mysql",
                    url: configService.get("DATABASE_URL"),
                    entities: [
                        user_entity_1.User,
                        stagiaire_entity_1.Stagiaire,
                        formation_entity_1.Formation,
                        catalogue_formation_entity_1.CatalogueFormation,
                        quiz_entity_1.Quiz,
                        question_entity_1.Question,
                        reponse_entity_1.Reponse,
                        media_entity_1.Media,
                        progression_entity_1.Progression,
                        quiz_participation_entity_1.QuizParticipation,
                        quiz_participation_answer_entity_1.QuizParticipationAnswer,
                        classement_entity_1.Classement,
                        formateur_entity_1.Formateur,
                        commercial_entity_1.Commercial,
                        pole_relation_client_entity_1.PoleRelationClient,
                        notification_entity_1.Notification,
                        demande_inscription_entity_1.DemandeInscription,
                        achievement_entity_1.Achievement,
                        parrainage_entity_1.Parrainage,
                        parrainage_token_entity_1.ParrainageToken,
                        parrainage_event_entity_1.ParrainageEvent,
                        stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation,
                        media_stagiaire_entity_1.MediaStagiaire,
                        stagiaire_achievement_entity_1.StagiaireAchievement,
                        correspondance_pair_entity_1.CorrespondancePair,
                        partenaire_entity_1.Partenaire,
                        agenda_entity_1.Agenda,
                        announcement_entity_1.Announcement,
                        challenge_entity_1.Challenge,
                    ],
                    synchronize: false,
                    logging: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                stagiaire_entity_1.Stagiaire,
                formation_entity_1.Formation,
                catalogue_formation_entity_1.CatalogueFormation,
                quiz_entity_1.Quiz,
                question_entity_1.Question,
                reponse_entity_1.Reponse,
                media_entity_1.Media,
                progression_entity_1.Progression,
                quiz_participation_entity_1.QuizParticipation,
                quiz_participation_answer_entity_1.QuizParticipationAnswer,
                classement_entity_1.Classement,
                formateur_entity_1.Formateur,
                commercial_entity_1.Commercial,
                pole_relation_client_entity_1.PoleRelationClient,
                notification_entity_1.Notification,
                demande_inscription_entity_1.DemandeInscription,
                achievement_entity_1.Achievement,
                parrainage_entity_1.Parrainage,
                parrainage_token_entity_1.ParrainageToken,
                parrainage_event_entity_1.ParrainageEvent,
                stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation,
                media_stagiaire_entity_1.MediaStagiaire,
                stagiaire_achievement_entity_1.StagiaireAchievement,
                correspondance_pair_entity_1.CorrespondancePair,
                partenaire_entity_1.Partenaire,
                agenda_entity_1.Agenda,
                announcement_entity_1.Announcement,
                challenge_entity_1.Challenge,
            ]),
            auth_module_1.AuthModule,
            stagiaire_module_1.StagiaireModule,
            formation_module_1.FormationModule,
            quiz_module_1.QuizModule,
            ranking_module_1.RankingModule,
            notification_module_1.NotificationModule,
            inscription_module_1.InscriptionModule,
            achievement_module_1.AchievementModule,
            parrainage_module_1.ParrainageModule,
            admin_module_1.AdminModule,
            catalogue_formation_module_1.CatalogueFormationModule,
            media_module_1.MediaModule,
            agenda_module_1.AgendaModule,
            announcement_module_1.AnnouncementModule,
            challenge_module_1.ChallengeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
//# sourceMappingURL=app.module.js.map