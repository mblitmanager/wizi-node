import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { StagiaireService } from "./stagiaire.service";

@Controller("stagiaires")
export class StagiairesController {
  constructor(private stagiaireService: StagiaireService) {}

  @Get(":id/details")
  async getStagiaireDetails(@Param("id") id: number) {
    try {
      const stagiaire = await this.stagiaireService.getStagiaireById(id);
      if (!stagiaire) {
        throw new HttpException(
          "Stagiaire not found",
          HttpStatus.NOT_FOUND
        );
      }
      return stagiaire;
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
