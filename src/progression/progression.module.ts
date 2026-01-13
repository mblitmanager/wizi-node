import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Progression } from "../entities/progression.entity";
import { ProgressionService } from "./progression.service";
import { ProgressionController } from "./progression.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Progression])],
  controllers: [ProgressionController],
  providers: [ProgressionService],
  exports: [ProgressionService],
})
export class ProgressionModule {}
