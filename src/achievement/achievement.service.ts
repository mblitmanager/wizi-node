import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>
  ) {}

  async getAchievements(stagiaireId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: ["achievements"],
    });
    return stagiaire?.achievements || [];
  }

  async getAllAchievements() {
    return this.achievementRepository.find({
      relations: ["quiz"],
    });
  }

  async unlockAchievementByCode(stagiaireId: number, code: string) {
    const achievement = await this.achievementRepository.findOne({
      where: { code },
    });

    if (!achievement) return [];

    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: ["achievements"],
    });

    if (!stagiaire) return [];

    const isAlreadyUnlocked = stagiaire.achievements.some(
      (a) => a.id === achievement.id
    );

    if (!isAlreadyUnlocked) {
      stagiaire.achievements.push(achievement);
      await this.stagiaireRepository.save(stagiaire);
      return [achievement];
    }

    return [];
  }

  async checkAchievements(stagiaireId: number, quizId?: number) {
    return [];
  }
}
