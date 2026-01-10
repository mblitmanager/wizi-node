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
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { MailService } from "../mail/mail.service";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

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
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(DemandeInscription)
    private demandeInscriptionRepository: Repository<DemandeInscription>,
    @InjectRepository(CatalogueFormation)
    private catalogueFormationRepository: Repository<CatalogueFormation>,
    private dataSource: DataSource,
    private mailService: MailService
  ) {}

  async registerFilleul(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const email =
        data.email ||
        `temp_${crypto.randomBytes(5).toString("hex")}@parrainage.com`;

      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException(
          "Cette adresse e-mail est déjà utilisée."
        );
      }

      // Create User
      const user = queryRunner.manager.create(User, {
        name: data.nom || `Filleul ${crypto.randomBytes(3).toString("hex")}`,
        email: email,
        password: await bcrypt.hash(crypto.randomBytes(8).toString("hex"), 10),
        role: "stagiaire",
      });
      const savedUser = await queryRunner.manager.save(User, user);

      // Create Stagiaire
      const stagiaire = queryRunner.manager.create(Stagiaire, {
        user_id: savedUser.id,
        civilite: data.civilite,
        prenom: data.prenom,
        telephone: data.telephone,
        adresse: data.adresse,
        code_postal: data.code_postal,
        ville: data.ville,
        date_naissance: data.date_naissance
          ? new Date(data.date_naissance)
          : null,
        date_debut_formation: data.date_debut_formation
          ? new Date(data.date_debut_formation)
          : null,
        date_inscription: data.date_inscription
          ? new Date(data.date_inscription)
          : new Date(),
        statut: data.statut || "en_attente",
      });
      const savedStagiaire = await queryRunner.manager.save(
        Stagiaire,
        stagiaire
      );

      // Create Parrainage
      const parrainage = queryRunner.manager.create(Parrainage, {
        parrain_id: data.parrain_id,
        filleul_id: savedUser.id,
        date_parrainage: new Date(),
        points: 2,
        gains: 50.0,
      });
      await queryRunner.manager.save(Parrainage, parrainage);

      // Associate with formation if provided
      if (data.catalogue_formation_id) {
        await queryRunner.manager.insert("stagiaire_catalogue_formations", {
          stagiaire_id: savedStagiaire.id,
          catalogue_formation_id: data.catalogue_formation_id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Create DemandeInscription
      const demande = queryRunner.manager.create(DemandeInscription, {
        parrain_id: data.parrain_id,
        filleul_id: savedUser.id,
        formation_id: data.catalogue_formation_id,
        statut: "complete",
        donnees_formulaire: JSON.stringify(data),
        lien_parrainage: data.lien_parrainage,
        motif: data.motif,
        date_demande: new Date(),
        date_inscription: new Date(),
      });
      await queryRunner.manager.save(DemandeInscription, demande);

      await queryRunner.commitTransaction();

      // Send confirmation email
      try {
        await this.mailService.sendMail(
          savedUser.email,
          "Confirmation d'inscription - Wizi Learn",
          "confirmation",
          { name: savedStagiaire.prenom || savedUser.name }
        );
      } catch (mailError) {
        console.error("Failed to send confirmation email:", mailError);
        // We don't throw here to avoid rolling back the transaction for a mail failure
      }

      return {
        success: true,
        message: "Inscription réussie! Les équipes ont été notifiées.",
        data: {
          user: {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
          },
          stagiaire: { id: savedStagiaire.id },
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

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

  async getRewards(parrainId: number) {
    const parrainages = await this.parrainageRepository.find({
      where: { parrain_id: parrainId },
    });

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
      total_points: totalPoints,
      total_filleuls: parrainages.length,
      gains: gains,
      rewards: parrainages.map((p) => ({
        id: p.id,
        points: p.points,
        date: p.date_parrainage,
      })),
    };
  }

  async getHistory(parrainId: number) {
    const parrainages = await this.parrainageRepository.find({
      where: { parrain_id: parrainId },
      relations: ["filleul", "filleul.stagiaire"],
      order: { date_parrainage: "DESC" },
    });

    const tokens = await this.parrainageTokenRepository.find({
      where: { user_id: parrainId },
      order: { created_at: "DESC" },
    });

    return {
      success: true,
      parrainages: parrainages.map((p) => ({
        id: p.id,
        parrain_id: p.parrain_id,
        filleul_id: p.filleul_id,
        points: p.points,
        gains: p.gains,
        created_at: p.date_parrainage || p.created_at,
        filleul: p.filleul
          ? {
              id: p.filleul.id,
              name: p.filleul.name,
              statut: p.filleul.stagiaire?.statut,
            }
          : null,
      })),
      tokens: tokens.map((t) => ({
        id: t.id,
        token: t.token,
        created_at: t.created_at,
        expires_at: t.expires_at,
      })),
    };
  }
}
