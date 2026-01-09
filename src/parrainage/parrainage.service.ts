import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { User } from "../entities/user.entity";
import * as crypto from "crypto";

@Injectable()
export class ParrainageService {
  constructor(
    @InjectRepository(Parrainage)
    private parrainageRepository: Repository<Parrainage>,
    @InjectRepository(ParrainageToken)
    private tokenRepository: Repository<ParrainageToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async generateLink(userId: number) {
    const token = crypto.randomBytes(20).toString("hex");
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["stagiaire"],
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const parrainageToken = this.tokenRepository.create({
      token,
      user_id: userId,
      parrain_data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        stagiaire: user.stagiaire,
      },
      expires_at: expiresAt,
    });

    await this.tokenRepository.save(parrainageToken);

    return {
      success: true,
      token,
    };
  }

  async getParrainData(token: string) {
    const parrainageToken = await this.tokenRepository.findOne({
      where: { token },
    });

    if (!parrainageToken || parrainageToken.expires_at < new Date()) {
      return {
        success: false,
        message: "Lien de parrainage invalide ou expiré",
      };
    }

    return {
      success: true,
      parrain: parrainageToken.parrain_data,
    };
  }

  async getStatsParrain(userId: number) {
    const count = await this.parrainageRepository.count({
      where: { parrain_id: userId },
    });

    const sumPoints = await this.parrainageRepository
      .createQueryBuilder("p")
      .select("SUM(p.points)", "total")
      .where("p.parrain_id = :userId", { userId })
      .getRawOne();

    const sumGains = await this.parrainageRepository
      .createQueryBuilder("p")
      .select("SUM(p.gains)", "total")
      .where("p.parrain_id = :userId", { userId })
      .getRawOne();

    return {
      success: true,
      parrain_id: userId,
      nombre_filleuls: parseInt(count.toString()),
      total_points: parseInt(sumPoints?.total || 0),
      gains: parseFloat(sumGains?.total || 0),
    };
  }
}
