import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Param,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StagiaireService } from "./stagiaire.service";
import { InscriptionService } from "../inscription/inscription.service";

@Controller("stagiaire")
export class StagiaireController {
  constructor(
    private stagiaireService: StagiaireService,
    private inscriptionService: InscriptionService
  ) {}

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
      const data = await this.stagiaireService.getContacts(req.user.id);
      return data;
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
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "commercial"
      );
      return contacts;
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
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "formateur"
      );
      return contacts;
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
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-relation"
      );
      return contacts;
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
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-save"
      );
      return contacts;
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

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/formations")
  async getStagiaireFormations(@Param("id") id: number) {
    try {
      return await this.stagiaireService.getFormationsByStagiaire(id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("inscription-catalogue-formation")
  async inscrireAFormation(
    @Request() req,
    @Body("catalogue_formation_id") catalogueFormationId: number
  ) {
    try {
      return await this.inscriptionService.inscrire(
        req.user.id,
        catalogueFormationId
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
