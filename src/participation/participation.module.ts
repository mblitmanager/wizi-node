import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Participation } from "../entities/participation.entity";
import { ParticipationService } from "./participation.service";
import { ParticipationController } from "./participation.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Participation])],
  controllers: [ParticipationController],
  providers: [ParticipationService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
