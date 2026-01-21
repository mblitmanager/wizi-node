"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./entities/user.entity");
const stagiaire_entity_1 = require("./entities/stagiaire.entity");
const formation_entity_1 = require("./entities/formation.entity");
const catalogue_formation_entity_1 = require("./entities/catalogue-formation.entity");
const quiz_entity_1 = require("./entities/quiz.entity");
const question_entity_1 = require("./entities/question.entity");
const reponse_entity_1 = require("./entities/reponse.entity");
const participation_entity_1 = require("./entities/participation.entity");
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
const google_calendar_entity_1 = require("./entities/google-calendar.entity");
const google_calendar_event_entity_1 = require("./entities/google-calendar-event.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
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
        participation_entity_1.Participation,
        google_calendar_entity_1.GoogleCalendar,
        google_calendar_event_entity_1.GoogleCalendarEvent,
    ],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "typeorm_migrations",
});
//# sourceMappingURL=data-source.js.map