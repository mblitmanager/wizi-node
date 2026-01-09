import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InscriptionService } from "./inscription.service";

@Controller("inscription")
@UseGuards(AuthGuard("jwt"))
export class InscriptionController {
  constructor(private readonly inscriptionService: InscriptionService) {}

  @Post("inscrire")
  async inscrire(
    @Request() req,
    @Body("catalogue_formation_id") catalogueFormationId: number
  ) {
    return this.inscriptionService.inscrire(req.user.id, catalogueFormationId);
  }
}
