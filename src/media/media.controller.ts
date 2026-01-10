import { Controller, Get, UseGuards, Query, Req } from "@nestjs/common";
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
  @UseGuards(AuthGuard("jwt"))
  getTutoriels() {
    return this.mediaService.findByType("tutoriel");
  }

  @Get("astuces")
  async getAstuces(@Query("page") page: string = "1", @Req() req: Request) {
    const pageNum = parseInt(page) || 1;
    // Build full URL based on request
    const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/astuces`;
    
    return this.mediaService.findByCategoriePaginated("astuce", pageNum, 10, baseUrl);
  }
}
