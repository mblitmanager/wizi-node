import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
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

    const lastPage = Math.ceil(total / perPage);
    const formattedData = data.map((media) => this.formatMedia(media));

    return {
      current_page: page,
      data: formattedData,
      first_page_url: `${baseUrl}?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: lastPage,
      last_page_url: `${baseUrl}?page=${lastPage}`,
      links: this.generateLinks(page, lastPage, baseUrl),
      next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      path: baseUrl,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
      to: Math.min(page * perPage, total),
      total,
    };
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

    const lastPage = Math.ceil(total / perPage);
    const formattedData = data.map((media) => this.formatMedia(media));

    return {
      current_page: page,
      data: formattedData,
      first_page_url: `${baseUrl}?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: lastPage,
      last_page_url: `${baseUrl}?page=${lastPage}`,
      links: this.generateLinks(page, lastPage, baseUrl),
      next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      path: baseUrl,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
      to: Math.min(page * perPage, total),
      total,
    };
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

  private formatMedia(media: Media) {
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
      created_at: media.created_at?.toISOString(),
      updated_at: media.updated_at?.toISOString(),
      video_url: media.video_url,
      subtitle_url: media.subtitle_url,
      stagiaires: (media.mediaStagiaires || []).map((ms) => ({
        id: ms.stagiaire_id,
        is_watched: ms.is_watched ? 1 : 0,
        watched_at: ms.watched_at,
        pivot: {
          media_id: media.id,
          stagiaire_id: ms.stagiaire_id,
          is_watched: ms.is_watched ? 1 : 0,
          watched_at: ms.watched_at,
          created_at: ms.created_at,
          updated_at: ms.updated_at,
        },
      })),
    };
  }
}
