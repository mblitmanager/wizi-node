import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
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
    try {
      return await this.stagiaireService.getHomeData(req.user.id);
    } catch (error) {
      console.error("Error in getHomeData:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts")
  async getContacts(@Request() req) {
    try {
      return await this.stagiaireService.getContacts(req.user.id);
    } catch (error) {
      console.error("Error in getContacts:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/commerciaux")
  async getCommerciaux(@Request() req) {
    try {
      return await this.stagiaireService.getContactsByType(
        req.user.id,
        "commercial"
      );
    } catch (error) {
      console.error("Error in getCommerciaux:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/formateurs")
  async getFormateurs(@Request() req) {
    try {
      return await this.stagiaireService.getContactsByType(
        req.user.id,
        "formateur"
      );
    } catch (error) {
      console.error("Error in getFormateurs:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-relation")
  async getPoleRelation(@Request() req) {
    try {
      return await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-relation"
      );
    } catch (error) {
      console.error("Error in getPoleRelation:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-save")
  async getPoleSave(@Request() req) {
    try {
      return await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-save"
      );
    } catch (error) {
      console.error("Error in getPoleSave:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("quizzes")
  async getMyQuizzes(@Request() req) {
    return this.stagiaireService.getStagiaireQuizzes(req.user.id);
  }
}
