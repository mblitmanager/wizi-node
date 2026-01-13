import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CommonModule } from "./common/common.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./common/guards/roles.guard";
import { User } from "./entities/user.entity";
import { Stagiaire } from "./entities/stagiaire.entity";
import { Formation } from "./entities/formation.entity";
import { CatalogueFormation } from "./entities/catalogue-formation.entity";
import { Quiz } from "./entities/quiz.entity";
import { Question } from "./entities/question.entity";
import { Reponse } from "./entities/reponse.entity";
import { AuthModule } from "./auth/auth.module";
import { StagiaireModule } from "./stagiaire/stagiaire.module";
import { FormationModule } from "./formation/formation.module";
import { QuizModule } from "./quiz/quiz.module";
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
import { RankingModule } from "./ranking/ranking.module";
import { NotificationModule } from "./notification/notification.module";
import { InscriptionModule } from "./inscription/inscription.module";
import { AchievementModule } from "./achievement/achievement.module";
import { ParrainageModule } from "./parrainage/parrainage.module";
import { CatalogueFormationModule } from "./catalogue-formation/catalogue-formation.module";
import { AdminModule } from "./admin/admin.module";
import { MediaModule } from "./media/media.module";
import { MailModule } from "./mail/mail.module";
import { AgendaModule } from "./agenda/agenda.module";
import { AnnouncementModule } from "./announcement/announcement.module";
import { ChallengeModule } from "./challenge/challenge.module";
import { ParticipationModule } from "./participation/participation.module";
import { PoleRelationClientModule } from "./pole-relation-client/pole-relation-client.module";
import { ProgressionModule } from "./progression/progression.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        url: configService.get("DATABASE_URL"),
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
        ],
        synchronize: false,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([
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
    ]),
    AuthModule,
    StagiaireModule,
    FormationModule,
    QuizModule,
    RankingModule,
    NotificationModule,
    InscriptionModule,
    AchievementModule,
    ParrainageModule,
    AdminModule,
    CatalogueFormationModule,
    MediaModule,
    AgendaModule,
    AnnouncementModule,
    ChallengeModule,
    ParticipationModule,
    PoleRelationClientModule,
    ProgressionModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    console.log("AppModule loaded - MediaModule should be active");
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
