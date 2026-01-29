import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgendaService } from "./agenda.service";
import { AgendaController } from "./agenda.controller";
import { AgendasApiController } from "./agendas-api.controller";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";
import { GoogleCalendar } from "../entities/google-calendar.entity";
import { GoogleCalendarEvent } from "../entities/google-calendar-event.entity";
import { Formateur } from "../entities/formateur.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agenda,
      Stagiaire,
      Notification,
      GoogleCalendar,
      GoogleCalendarEvent,
      Formateur,
      User,
    ]),
  ],
  controllers: [AgendaController, AgendasApiController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
