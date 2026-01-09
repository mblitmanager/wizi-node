import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Injectable()
export class FormationService {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>
  ) {}

  async getAllFormations() {
    return this.formationRepository.find();
  }

  async getAllCatalogueFormations() {
    return this.catalogueRepository.find();
  }

  async getCatalogueWithFormations() {
    // In Laravel this might be a complex relation, here simplifying
    return this.catalogueRepository.find({
      relations: ["stagiaires"],
    });
  }
}
