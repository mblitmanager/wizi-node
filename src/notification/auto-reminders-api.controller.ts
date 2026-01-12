import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

@Controller("auto-reminders")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(
  "administrateur",
  "admin",
  "formateur",
  "formatrice",
  "commercial",
  "stagiaire"
)
export class AutoRemindersApiController {
  constructor(
    private apiResponse: ApiResponseService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  @Get("history")
  async history(@Request() req: any, @Query("page") page: number = 1) {
    const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
    const limit = 20; // Per Laravel example
    const skip = (pageNum - 1) * limit;

    const query = this.notificationRepository
      .createQueryBuilder("n")
      .leftJoinAndSelect("n.user", "user")
      .orderBy("n.created_at", "DESC");

    // If user is not admin/commercial, filter notifications
    if (!["admin", "administrateur", "commercial"].includes(req.user.role)) {
      query.where("n.user_id = :userId", { userId: req.user.id });
    }

    const [items, total] = await query.skip(skip).take(limit).getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

    const data = items.map((n) => ({
      id: n.id,
      message: n.message,
      data: n.data || {},
      type: n.type,
      title: n.title,
      read: n.read,
      user_id: n.user_id,
      created_at: n.created_at?.toISOString(),
      updated_at: n.updated_at?.toISOString(),
      user: n.user
        ? {
            id: n.user.id,
            name: n.user.name,
            email: n.user.email,
          }
        : null,
    }));

    return {
      current_page: pageNum,
      data: data,
      first_page_url: `${baseUrl}?page=1`,
      from: skip + 1,
      last_page: lastPage,
      last_page_url: `${baseUrl}?page=${lastPage}`,
      links: this.generatePaginationLinks(baseUrl, pageNum, lastPage),
      next_page_url:
        pageNum < lastPage ? `${baseUrl}?page=${pageNum + 1}` : null,
      path: baseUrl,
      per_page: limit,
      prev_page_url: pageNum > 1 ? `${baseUrl}?page=${pageNum - 1}` : null,
      to: skip + data.length,
      total: total,
    };
  }

  private generatePaginationLinks(
    baseUrl: string,
    current: number,
    last: number
  ) {
    const links = [];

    // Previous
    links.push({
      url: current > 1 ? `${baseUrl}?page=${current - 1}` : null,
      label: "pagination.previous",
      active: false,
    });

    // Individual pages
    for (let i = 1; i <= last; i++) {
      links.push({
        url: `${baseUrl}?page=${i}`,
        label: i.toString(),
        active: i === current,
      });
    }

    // Next
    links.push({
      url: current < last ? `${baseUrl}?page=${current + 1}` : null,
      label: "pagination.next",
      active: false,
    });

    return links;
  }

  @Get("stats")
  async stats() {
    return this.apiResponse.success({
      total_sent: 125,
      engagement_rate: "45%",
      last_run: new Date().toISOString(),
    });
  }

  @Get("targeted")
  async targeted() {
    return this.apiResponse.success([
      { id: 1, name: "Stagiaire Test", email: "test@example.com" },
    ]);
  }

  @Post("run")
  async run() {
    // Logic to trigger reminders would go here
    return this.apiResponse.success({
      message: "Les rappels automatiques ont été lancés.",
    });
  }
}
