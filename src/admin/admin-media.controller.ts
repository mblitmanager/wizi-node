import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileInterceptor } from "@nestjs/platform-express";
import { Media } from "../entities/media.entity";
import { type Express } from "express";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/medias")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminMediaController {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.mediaRepository.createQueryBuilder("m");

    if (search) {
      query.where("m.titre LIKE :search OR m.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("m.id", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException("Média non trouvé");
    }

    return this.apiResponse.success(media);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(@Body() data: any, @UploadedFile() file?: Express.Multer.File) {
    if (!data.titre) {
      throw new BadRequestException("titre est obligatoire");
    }

    const mediaData = {
      ...data,
      file_path: file ? `/uploads/${file.filename}` : null,
    };

    const media = this.mediaRepository.create(mediaData);
    const saved = await this.mediaRepository.save(media);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException("Média non trouvé");
    }

    await this.mediaRepository.update(id, data);
    const updated = await this.mediaRepository.findOne({
      where: { id },
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException("Média non trouvé");
    }

    await this.mediaRepository.delete(id);

    return this.apiResponse.success();
  }
}
