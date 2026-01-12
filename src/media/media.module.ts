import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { StagiaireMediaController } from "./stagiaire-media.controller";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { AchievementModule } from "../achievement/achievement.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaStagiaire, Stagiaire]),
    AchievementModule,
  ],
  controllers: [MediaController, StagiaireMediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
