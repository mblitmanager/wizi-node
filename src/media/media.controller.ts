import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MediaService } from "./media.service";

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
  @UseGuards(AuthGuard("jwt"))
  getAstuces() {
    return this.mediaService.findByType("astuce");
  }
}
