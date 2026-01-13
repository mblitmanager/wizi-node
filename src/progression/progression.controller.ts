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
import { ProgressionService } from "./progression.service";

@Controller("progressions")
// @UseGuards(AuthGuard("jwt"))
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get()
  async findAll(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/progressions`;
    return this.progressionService.findAll(pageNum, 10, baseUrl); // default perPage: 10
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const progression = await this.progressionService.findOne(id);
    if (!progression) {
      throw new NotFoundException("Progression not found");
    }
    return progression;
  }
}
