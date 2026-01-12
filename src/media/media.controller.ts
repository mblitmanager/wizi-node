import { Controller, Get, UseGuards, Query, Req, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MediaService } from "./media.service";
import { Request } from "express";

@Controller("medias")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  findAll() {
    return this.mediaService.findAll();
  }

  @Get("tutoriels")
  @Get("tutoriels")
  async getTutoriels(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    // Build full URL based on request
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/tutoriels`;
    const userId = req.user?.id;

    return this.mediaService.findByCategoriePaginated(
      "tutoriel",
      pageNum,
      10,
      baseUrl,
      userId
    );
  }

  @Get("astuces")
  @Get("astuces")
  async getAstuces(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    // Build full URL based on request
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/astuces`;
    const userId = req.user?.id;

    return this.mediaService.findByCategoriePaginated(
      "astuce",
      pageNum,
      10,
      baseUrl,
      userId
    );
  }

  @Get("formations/:formationId/tutoriels")
  @UseGuards(AuthGuard("jwt"))
  async getTutorielsByFormation(
    @Param("formationId") formationId: number,
    @Req() req: any
  ) {
    const userId = req.user?.id;
    return this.mediaService.findByFormationAndCategorie(
      formationId,
      "tutoriel",
      userId
    );
  }

  @Get("formations/:formationId/astuces")
  @UseGuards(AuthGuard("jwt"))
  async getAstucesByFormation(
    @Param("formationId") formationId: number,
    @Req() req: any
  ) {
    const userId = req.user?.id;
    return this.mediaService.findByFormationAndCategorie(
      formationId,
      "astuce",
      userId
    );
  }
}
