import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, DataSource } from "typeorm";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import * as crypto from "crypto";

@Injectable()
export class ParrainageService {
  constructor(
    @InjectRepository(Parrainage)
    private parrainageRepository: Repository<Parrainage>,
    @InjectRepository(ParrainageToken)
    private parrainageTokenRepository: Repository<ParrainageToken>,
    @InjectRepository(ParrainageEvent)
    private parrainageEventRepository: Repository<ParrainageEvent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async generateLink(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["stagiaire"],
    });

    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const parrainageToken = this.parrainageTokenRepository.create({
      token,
      user_id: userId,
      parrain_data: JSON.stringify({
        user: { id: user.id, name: user.name, image: user.image },
        stagiaire: user.stagiaire ? { prenom: user.stagiaire.prenom } : null,
      }),
      expires_at: expiresAt,
    });

    await this.parrainageTokenRepository.save(parrainageToken);

    return { success: true, token };
  }

  async getParrainData(token: string) {
    const parrainageToken = await this.parrainageTokenRepository.findOne({
      where: {
        token,
        expires_at: MoreThan(new Date()),
      },
    });

    if (!parrainageToken) {
      throw new NotFoundException("Lien de parrainage invalide ou expiré");
    }

    return {
      success: true,
      parrain: JSON.parse(parrainageToken.parrain_data),
    };
  }

  async getStatsParrain(userId: number) {
    const parrainages = await this.parrainageRepository.find({
      where: { parrain_id: userId },
    });

    const nombreFilleuls = parrainages.length;
    const totalPoints = parrainages.reduce(
      (sum, p) => sum + (p.points || 0),
      0
    );
    const gains = parrainages.reduce(
      (sum, p) => sum + (Number(p.gains) || 0),
      0
    );

    return {
      success: true,
      parrain_id: userId,
      nombre_filleuls: nombreFilleuls,
      total_points: totalPoints,
      gains: gains,
    };
  }

  async getEvents() {
    const events = await this.parrainageEventRepository.find({
      order: { date_debut: "ASC" },
    });

    return {
      success: true,
      data: events,
    };
  }

  async getFilleuls(parrainId: number) {
    const parrainages = await this.parrainageRepository.find({
      where: { parrain_id: parrainId },
      relations: ["filleul", "filleul.stagiaire"],
    });

    return {
      success: true,
      data: parrainages.map((p) => ({
        id: p.filleul_id,
        name: p.filleul?.name,
        date: p.date_parrainage,
        points: p.points,
        status: p.filleul?.stagiaire?.statut || "en_attente",
      })),
    };
  }
}
