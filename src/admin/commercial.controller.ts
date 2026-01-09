import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("commercial")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("commercial", "admin")
export class CommercialController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats/dashboard")
  async getDashboardStats(@Request() req) {
    // For now, commercial dashboard can use similar logic or a specialized one
    // In Laravel, it's often more related to sales and sponsorship stats.
    return {
      success: true,
      stats: {
        total_leads: 0,
        conversions: 0,
        active_partners: 0,
      },
    };
  }
}
