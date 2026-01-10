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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileInterceptor } from "@nestjs/platform-express";
import { Media } from "../entities/media.entity";
import { type Express } from "express";

@Controller("admin/medias")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminMediaController {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>
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

    return {
      data,
      pagination: {
        total,
        page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.mediaRepository.findOne({
      where: { id },
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(@Body() data: any, @UploadedFile() file?: Express.Multer.File) {
    const mediaData = {
      ...data,
      file_path: file ? `/uploads/${file.filename}` : null,
    };

    const media = this.mediaRepository.create(mediaData);
    return this.mediaRepository.save(media);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.mediaRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.mediaRepository.delete(id);
  }
}
