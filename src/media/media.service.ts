import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>
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
        "m.stagiaires",
        "stagiaires",
        "stagiaires.user_id = :userId",
        { userId }
      );
    }

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);

    // Format data to match Laravel structure exactly
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

    // Previous link
    links.push({
      url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
      label: "pagination.previous",
      active: false,
    });

    // Page numbers
    for (let i = 1; i <= lastPage; i++) {
      links.push({
        url: `${baseUrl}?page=${i}`,
        label: i.toString(),
        active: i === currentPage,
      });
    }

    // Next link
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
        "m.stagiaires",
        "stagiaires",
        "stagiaires.user_id = :userId",
        { userId }
      );
    }

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);
    const formattedData = data.map((media) => this.formatMedia(media));

    // If no baseUrl is provided, return just the data array (backward compatibility if needed, but we want pagination)
    if (!baseUrl) {
      // Wait, if Laravel returns paginated object, we must return object.
      // But wait, look at the User's input in Step 2534. They showed an ARRAY. And said it is erroneous.
      // The target (Laravel) return for `getTutorielsByFormation` is `response()->json($tutoriels)`.
      // $tutoriels comes from `getTutorielsByFormation` which takes $perPage. So it IS paginated.
      // I'll return the full pagination object.
    }

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

  private formatMedia(media: Media) {
    // Helper to format media object exactly like Laravel
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
      video_url: media.video_url, // Computed by @AfterLoad
      subtitle_url: media.subtitle_url, // Computed by @AfterLoad
      stagiaires: (media.stagiaires || []).map((stagiaire) => ({
        id: stagiaire.id,
        is_watched: 1, // If present in relation, it is watched
        watched_at: null, // We don't have this in junction table entity yet, defaulting null
        pivot: {
          media_id: media.id,
          stagiaire_id: stagiaire.id,
          is_watched: 1,
          watched_at: null,
          created_at: null,
          updated_at: null,
        },
      })),
    };
  }
}
