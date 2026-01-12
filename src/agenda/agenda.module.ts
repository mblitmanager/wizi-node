import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgendaService } from "./agenda.service";
import { AgendaController } from "./agenda.controller";
import { AgendasApiController } from "./agendas-api.controller";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Agenda, Stagiaire, Notification])],
  controllers: [AgendaController, AgendasApiController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
