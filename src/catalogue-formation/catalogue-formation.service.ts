import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Injectable()
export class CatalogueFormationService {
  constructor(
    @InjectRepository(CatalogueFormation)
    private readonly catalogueRepository: Repository<CatalogueFormation>
  ) {}

  async findAll(): Promise<CatalogueFormation[]> {
    return this.catalogueRepository.find({
      where: {
        statut: 1,
        formation: {
          statut: 1,
        },
      },
      relations: ["formation"],
      order: {
        created_at: "DESC",
      },
    });
  }

  async findOne(id: number): Promise<CatalogueFormation> {
    const formation = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "formateurs", "stagiaires"], // Added relations based on Laravel show
    });
    if (!formation) {
      throw new NotFoundException("Catalogue formation not found");
    }
    return formation;
  }
}
