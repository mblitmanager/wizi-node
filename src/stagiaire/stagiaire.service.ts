import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";

@Injectable()
export class StagiaireService {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>
  ) {}

  async getProfile(userId: number) {
    return this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });
  }

  async getHomeData(userId: number) {
    // Replicate getHomeData logic from Laravel DashboardController
    // This is a complex query, for now returning a simplified version
    const stagiaire = await this.getProfile(userId);
    return {
      stagiaire,
      welcome_message: `Bonjour ${stagiaire?.prenom || ""}`,
      // Add more data as needed (formations, progress, etc.)
    };
  }
}
