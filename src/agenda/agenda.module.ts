import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgendaService } from "./agenda.service";
import { AgendaController } from "./agenda.controller";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Agenda, Stagiaire, Notification])],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
