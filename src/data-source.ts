import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entities/user.entity";
import { Stagiaire } from "./entities/stagiaire.entity";
import { Formation } from "./entities/formation.entity";
import { CatalogueFormation } from "./entities/catalogue-formation.entity";
import { Quiz } from "./entities/quiz.entity";
import { Question } from "./entities/question.entity";
import { Reponse } from "./entities/reponse.entity";
import { Participation } from "./entities/participation.entity";
import { Media } from "./entities/media.entity";
import { Progression } from "./entities/progression.entity";
import { QuizParticipation } from "./entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "./entities/quiz-participation-answer.entity";
import { Classement } from "./entities/classement.entity";
import { Formateur } from "./entities/formateur.entity";
import { Commercial } from "./entities/commercial.entity";
import { PoleRelationClient } from "./entities/pole-relation-client.entity";
import { Notification } from "./entities/notification.entity";
import { DemandeInscription } from "./entities/demande-inscription.entity";
import { Achievement } from "./entities/achievement.entity";
import { Parrainage } from "./entities/parrainage.entity";
import { ParrainageToken } from "./entities/parrainage-token.entity";
import { ParrainageEvent } from "./entities/parrainage-event.entity";
import { StagiaireCatalogueFormation } from "./entities/stagiaire-catalogue-formation.entity";
import { MediaStagiaire } from "./entities/media-stagiaire.entity";
import { StagiaireAchievement } from "./entities/stagiaire-achievement.entity";
import { CorrespondancePair } from "./entities/correspondance-pair.entity";
import { Partenaire } from "./entities/partenaire.entity";
import { Agenda } from "./entities/agenda.entity";
import { Announcement } from "./entities/announcement.entity";
import { Challenge } from "./entities/challenge.entity";
import { GoogleCalendar } from "./entities/google-calendar.entity";
import { GoogleCalendarEvent } from "./entities/google-calendar-event.entity";

config();

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [
    User,
    Stagiaire,
    Formation,
    CatalogueFormation,
    Quiz,
    Question,
    Reponse,
    Media,
    Progression,
    QuizParticipation,
    QuizParticipationAnswer,
    Classement,
    Formateur,
    Commercial,
    PoleRelationClient,
    Notification,
    DemandeInscription,
    Achievement,
    Parrainage,
    ParrainageToken,
    ParrainageEvent,
    StagiaireCatalogueFormation,
    MediaStagiaire,
    StagiaireAchievement,
    CorrespondancePair,
    Partenaire,
    Agenda,
    Announcement,
    Challenge,
    Participation,
    GoogleCalendar,
    GoogleCalendarEvent,
  ],
  migrations: ["src/migrations/*.ts"],
});
