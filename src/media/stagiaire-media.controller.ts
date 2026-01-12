import { Controller, Post, Param, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MediaService } from "./media.service";

@Controller("medias")
@UseGuards(AuthGuard("jwt"))
export class StagiaireMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post(":id/watched")
  async watched(@Param("id") id: number, @Request() req: any) {
    const userId = req.user.id;
    return this.mediaService.markAsWatched(id, userId);
  }
}
