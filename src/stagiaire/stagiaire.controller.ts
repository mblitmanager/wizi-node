import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StagiaireService } from "./stagiaire.service";

@Controller("stagiaire")
export class StagiaireController {
  constructor(private stagiaireService: StagiaireService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  async getProfile(@Request() req) {
    return this.stagiaireService.getProfile(req.user.id);
  }

  @Get("test-auth")
  async testAuth() {
    return { message: "Public endpoint works" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard/home")
  async getHomeData(@Request() req) {
    return this.stagiaireService.getHomeData(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts")
  async getContacts(@Request() req) {
    return this.stagiaireService.getContacts(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/commerciaux")
  async getCommerciaux(@Request() req) {
    return this.stagiaireService.getContactsByType(req.user.id, "commercial");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/formateurs")
  async getFormateurs(@Request() req) {
    return this.stagiaireService.getContactsByType(req.user.id, "formateur");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-relation")
  async getPoleRelation(@Request() req) {
    return this.stagiaireService.getContactsByType(
      req.user.id,
      "pole-relation"
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-save")
  async getPoleSave(@Request() req) {
    return this.stagiaireService.getContactsByType(req.user.id, "pole-save");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("quizzes")
  async getMyQuizzes(@Request() req) {
    return this.stagiaireService.getStagiaireQuizzes(req.user.id);
  }
}
