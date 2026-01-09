import { Controller, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParrainageEvent } from "../entities/parrainage-event.entity";

@Controller("parrainage-events")
export class ParrainageController {
  constructor(
    @InjectRepository(ParrainageEvent)
    private parrainageEventRepository: Repository<ParrainageEvent>
  ) {}

  @Get()
  async getEvents() {
    try {
      const events = await this.parrainageEventRepository.find({
        order: { date_debut: "ASC" },
      });

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erreur lors de la récupération des événements",
        error: error.message,
      };
    }
  }
}
