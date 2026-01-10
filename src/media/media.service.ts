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
    baseUrl: string = "https://localhost:3000/api/medias/astuces"
  ) {
    const query = this.mediaRepository.createQueryBuilder("m")
      .where("m.categorie = :categorie", { categorie })
      .orderBy("m.id", "DESC");

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);

    return {
      current_page: page,
      data,
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

  private generateLinks(currentPage: number, lastPage: number, baseUrl: string) {
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
}
