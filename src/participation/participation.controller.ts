import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ParticipationService } from "./participation.service";

@Controller("participations")
// @UseGuards(AuthGuard("jwt"))
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Get()
  async findAll(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/participations`;
    return this.participationService.findAll(pageNum, 30, baseUrl); // Default ApiPlatform perPage is often 30 or configurable
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const participation = await this.participationService.findOne(id);
    if (!participation) {
      throw new NotFoundException("Participation not found");
    }
    return participation;
  }
}
