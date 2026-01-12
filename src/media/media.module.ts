import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Media, MediaStagiaire])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
