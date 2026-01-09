import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        ],
        synchronize: false, // Don't sync as database exists
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
    ]),
    AuthModule,
    StagiaireModule,
    FormationModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
