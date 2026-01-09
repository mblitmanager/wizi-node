import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>
  ) {}

  async getGlobalRanking() {
    const allClassements = await this.classementRepository.find({
      relations: [
        "stagiaire",
        "stagiaire.user",
        "quiz",
        "stagiaire.formateurs",
        "stagiaire.formateurs.user",
      ],
    });

    const groupedByStagiaire = this.groupBy(allClassements, "stagiaire_id");

    const ranking = Object.keys(groupedByStagiaire).map((stagiaireId) => {
      const group = groupedByStagiaire[stagiaireId];
      const totalPoints = group.reduce(
        (sum, item) => sum + (item.points || 0),
        0
      );
      const first = group[0];
      const stagiaire = first.stagiaire;

      return {
        id: stagiaire.id,
        firstname: stagiaire.prenom || "",
        name: stagiaire.user?.name?.split(" ").slice(1).join(" ") || "",
        image: stagiaire.user?.image || null,
        score: totalPoints,
        totalPoints, // keep for compatibility
        quizCount: group.length,
        averageScore: totalPoints / group.length,
        formateurs: (stagiaire.formateurs || []).map((f: any) => ({
          id: f.id,
          prenom: f.prenom || "",
          nom: f.nom || f.user?.name?.split(" ").slice(1).join(" ") || "",
          image: f.user?.image || null,
        })),
      };
    });

    ranking.sort((a, b) => b.totalPoints - a.totalPoints);

    return ranking.map((item, index) => ({
      ...item,
      rang: index + 1,
      level: this.calculateLevel(item.totalPoints),
    }));
  }

  async getMyRanking(userId: number) {
    const globalRanking = await this.getGlobalRanking();
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });

    if (!stagiaire) {
      throw new Error("Stagiaire not found");
    }

    const myRanking = globalRanking.find((item) => item.id === stagiaire.id);

    if (!myRanking) {
      // If no points yet, return a default zero-state
      return {
        id: stagiaire.id,
        firstname: stagiaire.prenom || "",
        name: stagiaire.user?.name?.split(" ").slice(1).join(" ") || "",
        image: stagiaire.user?.image || null,
        score: 0,
        totalPoints: 0,
        quizCount: 0,
        averageScore: 0,
        rang: globalRanking.length + 1,
        level: "0",
        formateurs: [],
      };
    }

    return myRanking;
  }

  calculateLevel(points: number): string {
    const basePoints = 10;
    const maxLevel = 100;
    let level = "0";

    for (let l = 0; l <= maxLevel; l++) {
      const threshold = (l - 1) * basePoints;
      if (points >= threshold) {
        level = l.toString();
      } else {
        break;
      }
    }

    return level;
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
}
