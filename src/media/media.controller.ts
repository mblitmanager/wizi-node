import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Req,
  Param,
} from "@nestjs/common";
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

  @Get("server")
  async getServerMedias(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/server`;
    return this.mediaService.getServerMediasPaginated(pageNum, 20, baseUrl);
  }

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
      userId,
    );
  }

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
      userId,
    );
  }

  @Get("formations/:formationId/tutoriels")
  @UseGuards(AuthGuard("jwt"))
  async getTutorielsByFormation(
    @Param("formationId") formationId: number,
    @Req() req: any,
    @Query("page") page: string = "1",
  ) {
    const pageNum = parseInt(page) || 1;
    const userId = req.user?.id;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/formations/${formationId}/tutoriels`;

    return this.mediaService.findByFormationAndCategorie(
      formationId,
      "tutoriel",
      pageNum,
      10,
      baseUrl,
      userId,
    );
  }

  @Get("formations/:formationId/astuces")
  @UseGuards(AuthGuard("jwt"))
  async getAstucesByFormation(
    @Param("formationId") formationId: number,
    @Req() req: any,
    @Query("page") page: string = "1",
  ) {
    const pageNum = parseInt(page) || 1;
    const userId = req.user?.id;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/formations/${formationId}/astuces`;

    return this.mediaService.findByFormationAndCategorie(
      formationId,
      "astuce",
      pageNum,
      10,
      baseUrl,
      userId,
    );
  }

  @Get("formations/interactives")
  async getInteractivesFormations() {
    return this.mediaService.getInteractivesFormations();
  }

  @Get("formations-with-status")
  async getFormationsWithStatus() {
    return this.mediaService.getFormationsWithStatus();
  }

  @Post("updateProgress")
  @UseGuards(AuthGuard("jwt"))
  async updateProgress(
    @Req() req: any,
    @Body() data: { media_id: number; current_time: number; duration: number },
  ) {
    return this.mediaService.updateProgress(
      data.media_id,
      req.user.id,
      data.current_time,
      data.duration,
    );
  }
}
