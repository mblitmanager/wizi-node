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
import { PoleRelationClientService } from "./pole-relation-client.service";

@Controller("pole_relation_clients")
// @UseGuards(AuthGuard("jwt"))
export class PoleRelationClientController {
  constructor(private readonly prcService: PoleRelationClientService) {}

  @Get()
  async findAll(@Query("page") page: string = "1", @Req() req: any) {
    const pageNum = parseInt(page) || 1;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/pole_relation_clients`;
    return this.prcService.findAll(pageNum, 10, baseUrl); // default perPage: 10
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const prc = await this.prcService.findOne(id);
    if (!prc) {
      throw new NotFoundException("PoleRelationClient not found");
    }
    return prc;
  }
}
