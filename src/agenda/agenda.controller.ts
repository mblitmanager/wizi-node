import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Header,
  Res,
  Put,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AgendaService } from "./agenda.service";
import { Response } from "express";

@Controller("stagiaire/agenda")
export class AgendaController {
  constructor(private agendaService: AgendaService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getAgenda(@Request() req) {
    try {
      return await this.agendaService.getStagiaireAgenda(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("export")
  async exportAgenda(@Request() req, @Res() res: Response) {
    try {
      const ics = await this.agendaService.exportAgendaToICS(req.user.id);
      res.setHeader("Content-Type", "text/calendar");
      res.setHeader("Content-Disposition", 'attachment; filename="agenda.ics"');
      return res.send(ics);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("notifications")
  async getNotifications(@Request() req) {
    try {
      return await this.agendaService.getStagiaireNotifications(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("notifications/:id/read")
  async markAsRead(@Param("id") id: number) {
    try {
      const success = await this.agendaService.markNotificationAsRead(id);
      return { success };
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("notifications/read-all")
  async markAllAsRead(@Request() req) {
    try {
      const success = await this.agendaService.markAllNotificationsAsRead(
        req.user.id
      );
      return { success };
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
