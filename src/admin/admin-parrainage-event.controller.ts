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
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/parrainage_events")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminParrainageEventController {
  constructor(
    @InjectRepository(ParrainageEvent)
    private eventRepository: Repository<ParrainageEvent>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.eventRepository.createQueryBuilder("e");

    if (search) {
      query.where("e.titre LIKE :search", { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("e.id", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get("create")
  async create() {
    return this.apiResponse.success({ message: "Prepare for new event" });
  }

  @Post()
  async store(@Body() data: any) {
    const event = this.eventRepository.create(data);
    const saved = await this.eventRepository.save(event);
    return this.apiResponse.success(saved);
  }

  @Get(":id")
  async show(@Param("id") id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    return this.apiResponse.success(event);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");

    await this.eventRepository.update(id, data);
    const updated = await this.eventRepository.findOne({ where: { id } });
    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async destroy(@Param("id") id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");

    await this.eventRepository.delete(id);
    return this.apiResponse.success();
  }

  @Get(":id/edit")
  async edit(@Param("id") id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    return this.apiResponse.success(event);
  }
}
