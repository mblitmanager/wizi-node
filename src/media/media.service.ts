import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Formation } from "../entities/formation.entity";
import { AchievementService } from "../achievement/achievement.service";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaStagiaire)
    private mediaStagiaireRepository: Repository<MediaStagiaire>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    private achievementService: AchievementService
  ) {}

  async findAll() {
    return this.mediaRepository.find();
  }
  async findByType(type: string) {
    return this.mediaRepository.find({
      where: { type },
      order: { created_at: "DESC" },
    });
  }

  async getTutorials(userId?: number) {
    // Standard tutorials categorie in Laravel is 'tutoriel'
    const query = this.mediaRepository
      .createQueryBuilder("m")
      .where("m.categorie = :categorie", { categorie: "tutoriel" })
      .orderBy("m.id", "DESC");

    if (userId) {
      query.leftJoinAndSelect(
        "m.mediaStagiaires",
        "ms",
        "ms.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      );
    }

    const data = await query.getMany();
    return data.map((media) => this.formatMedia(media));
  }

  async findByCategoriePaginated(
    categorie: string,
    page: number = 1,
    perPage: number = 10,
    baseUrl: string = "https://localhost:3000/api/medias/astuces",
    userId?: number
  ) {
    const query = this.mediaRepository
      .createQueryBuilder("m")
      .where("m.categorie = :categorie", { categorie })
      .orderBy("m.id", "DESC");

    if (userId) {
      query.leftJoinAndSelect(
        "m.mediaStagiaires",
        "ms",
        "ms.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      );
    }

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((media) => this.formatMedia(media));

    return this.formatPagination(formattedData, total, page, perPage, baseUrl);
  }

  private generateLinks(
    currentPage: number,
    lastPage: number,
    baseUrl: string
  ) {
    const links: any[] = [];
    links.push({
      url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
      label: "pagination.previous",
      active: false,
    });
    for (let i = 1; i <= lastPage; i++) {
      links.push({
        url: `${baseUrl}?page=${i}`,
        label: i.toString(),
        active: i === currentPage,
      });
    }
    links.push({
      url: currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
      label: "pagination.next",
      active: false,
    });
    return links;
  }

  async findByFormationAndCategorie(
    formationId: number,
    categorie: string,
    page: number = 1,
    perPage: number = 10,
    baseUrl: string = "",
    userId?: number
  ) {
    const query = this.mediaRepository
      .createQueryBuilder("m")
      .where("m.formation_id = :formationId", { formationId })
      .andWhere("m.categorie = :categorie", { categorie })
      .orderBy("m.id", "DESC");

    if (userId) {
      query
        .leftJoinAndSelect("m.mediaStagiaires", "ms")
        .leftJoinAndSelect("ms.stagiaire", "s");
    }

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((media) => this.formatMedia(media));

    return this.formatPagination(formattedData, total, page, perPage, baseUrl);
  }

  private formatPagination(
    data: any[],
    total: number,
    page: number,
    perPage: number,
    baseUrl: string
  ) {
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      current_page: String(page).match(/^\d+$/) ? Number(page) : 1,
      data,
      first_page_url: `${baseUrl}?page=1`,
      from: total > 0 ? (page - 1) * perPage + 1 : null,
      last_page: lastPage,
      last_page_url: `${baseUrl}?page=${lastPage}`,
      links: this.generateLinks(page, lastPage, baseUrl),
      next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      path: baseUrl,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
      to: total > 0 ? Math.min(page * perPage, total) : null,
      total,
    };
  }

  async getInteractivesFormations() {
    const formations = await this.formationRepository
      .createQueryBuilder("f")
      .leftJoinAndSelect("f.medias", "m")
      .orderBy("f.id", "ASC")
      .getMany();

    return formations.map((f) => {
      const allMedias = (f.medias || []).map((m) => this.formatMedia(m, false));
      return {
        id: f.id,
        title: null, // Production example shows null
        description: f.description,
        duration: null, // Production example shows null
        tutoriels: allMedias.filter((m) => m.categorie === "tutoriel"),
        astuces: allMedias.filter((m) => m.categorie === "astuce"),
      };
    });
  }

  async getFormationsWithStatus() {
    const formations = await this.formationRepository
      .createQueryBuilder("f")
      .leftJoinAndSelect("f.medias", "m")
      .leftJoinAndSelect("m.mediaStagiaires", "ms")
      .leftJoinAndSelect("ms.stagiaire", "s")
      .orderBy("f.id", "ASC")
      .getMany();

    return formations.map((f) => ({
      id: f.id,
      titre: f.titre,
      slug: f.slug,
      description: f.description,
      statut: f.statut,
      duree: f.duree,
      categorie: f.categorie,
      image: f.image,
      icon: f.icon,
      created_at: this.formatIso(f.created_at),
      updated_at: this.formatIso(f.updated_at),
      medias: (f.medias || []).map((m) => this.formatMedia(m)),
    }));
  }

  async markAsWatched(mediaId: number, userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });
    if (!stagiaire) {
      throw new Error("Stagiaire not found");
    }

    let mediaStagiaire = await this.mediaStagiaireRepository.findOne({
      where: { media_id: mediaId, stagiaire_id: stagiaire.id },
    });

    if (mediaStagiaire) {
      mediaStagiaire.is_watched = true;
      mediaStagiaire.watched_at = new Date();
      await this.mediaStagiaireRepository.save(mediaStagiaire);
    } else {
      mediaStagiaire = this.mediaStagiaireRepository.create({
        media_id: mediaId,
        stagiaire_id: stagiaire.id,
        is_watched: true,
        watched_at: new Date(),
      });
      await this.mediaStagiaireRepository.save(mediaStagiaire);
    }

    // Check for achievements
    const newAchievements = await this.achievementService.checkAchievements(
      stagiaire.id
    );

    return {
      message: "Media marked as watched",
      new_achievements: newAchievements,
    };
  }

  private formatMedia(media: Media, includeStagiaires: boolean = true) {
    return {
      id: media.id,
      titre: media.titre,
      description: media.description,
      url: media.url,
      size: media.size,
      mime: media.mime,
      uploaded_by: media.uploaded_by,
      video_platform: media.video_platform || "server",
      video_file_path: media.video_file_path,
      subtitle_file_path: media.subtitle_file_path,
      subtitle_language: media.subtitle_language || "fr",
      type: media.type || "video",
      categorie: media.categorie,
      duree: media.duree,
      ordre: media.ordre,
      formation_id: media.formation_id,
      created_at: this.formatIso(media.created_at),
      updated_at: this.formatIso(media.updated_at),
      video_url: media.video_url || media.url || null,
      subtitle_url: null,
      ...(includeStagiaires && {
        stagiaires: (media.mediaStagiaires || [])
          .map((ms) => {
            const s = ms.stagiaire;
            if (!s) return null;
            return {
              id: s.id,
              prenom: s.prenom,
              civilite: s.civilite,
              telephone: s.telephone,
              adresse: s.adresse,
              date_naissance: this.formatDateOnly(s.date_naissance),
              ville: s.ville,
              code_postal: s.code_postal,
              date_debut_formation: this.formatDateOnly(s.date_debut_formation),
              date_inscription: this.formatDateOnly(s.date_inscription),
              role: s.role,
              statut: s.statut,
              user_id: s.user_id,
              deleted_at: null,
              created_at: this.formatIso(s.created_at),
              updated_at: this.formatIso(s.updated_at),
              date_fin_formation: this.formatDateOnly(s.date_fin_formation),
              login_streak: s.login_streak,
              last_login_at: this.formatDateTime(s.last_login_at),
              onboarding_seen: s.onboarding_seen ? 1 : 0,
              partenaire_id: s.partenaire_id,
              pivot: {
                media_id: media.id,
                stagiaire_id: s.id,
                is_watched: ms.is_watched ? 1 : 0,
                watched_at: this.formatDateTime(ms.watched_at),
                created_at: null,
                updated_at: this.formatIso(ms.updated_at),
              },
            };
          })
          .filter(Boolean),
      }),
    };
  }

  private formatIso(date: any) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().replace(".000Z", ".000000Z");
  }

  private formatDateOnly(date: any) {
    if (!date) return null;
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date))
      return date;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split("T")[0];
  }

  private formatDateTime(date: any) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split(".")[0].replace("T", " ");
  }
}
