import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("api/formateur")
@UseGuards(AuthGuard("jwt"))
export class FormateurApiController {
  constructor() {}

  @Get("dashboard/stats")
  async dashboardStats(@Request() req: any) {
    return { data: {}, message: "Dashboard stats" };
  }

  @Get("formations")
  async formations(@Request() req: any) {
    return { data: [], message: "My formations" };
  }

  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    return { data: [], message: "My stagiaires" };
  }

  @Get("stagiaires/online")
  async onlineStagiaires() {
    return { data: [], message: "Online stagiaires" };
  }

  @Get("stagiaires/inactive")
  async inactiveStagiaires() {
    return { data: [], message: "Inactive stagiaires" };
  }

  @Get("stagiaires/never-connected")
  async neverConnected() {
    return { data: [], message: "Never connected" };
  }

  @Get("stagiaires/performance")
  async performance() {
    return { data: [], message: "Performance stats" };
  }

  @Post("stagiaires/disconnect")
  async disconnect(@Body() data: any) {
    return { message: "Stagiaires disconnected" };
  }

  @Get("stagiaire/:id/stats")
  async stagiaireStats(@Param("id") id: number) {
    return { data: {}, message: "Stagiaire stats" };
  }

  @Get("video/:id/stats")
  async videoStats(@Param("id") id: number) {
    return { data: {}, message: "Video stats" };
  }

  @Get("videos")
  async videos() {
    return { data: [], message: "All videos" };
  }

  @Get("classement/formation/:formationId")
  async formationRanking(@Param("formationId") formationId: number) {
    return { data: [], message: "Formation ranking" };
  }

  @Get("classement/mes-stagiaires")
  async mesStagiairesRanking() {
    return { data: [], message: "My stagiaires ranking" };
  }

  @Post("send-email")
  async sendEmail(@Body() data: any) {
    return { message: "Email sent" };
  }

  @Post("send-notification")
  async sendNotification(@Body() data: any) {
    return { message: "Notification sent" };
  }

  @Get("stats/dashboard")
  async stats() {
    return { data: {}, message: "Statistics" };
  }
}

@Controller("api/commercial/stats")
@UseGuards(AuthGuard("jwt"))
export class CommercialApiController {
  constructor() {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return { data: {}, message: "Commercial dashboard" };
  }
}
