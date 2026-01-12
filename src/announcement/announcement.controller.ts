import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AnnouncementService } from "./announcement.service";

@Controller("announcements")
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async index(
    @Request() req,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    try {
      return await this.announcementService.getAnnouncements(
        req.user,
        page,
        limit
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async store(@Request() req, @Body() body: any) {
    try {
      return await this.announcementService.createAnnouncement(body, req.user);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("recipients")
  async getRecipients(@Request() req) {
    try {
      return await this.announcementService.getPotentialRecipients(req.user);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async show(@Param("id") id: number) {
    try {
      return await this.announcementService.getAnnouncement(id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  async update(@Request() req, @Param("id") id: number, @Body() body: any) {
    try {
      return await this.announcementService.updateAnnouncement(
        id,
        body,
        req.user
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async destroy(@Request() req, @Param("id") id: number) {
    try {
      return await this.announcementService.deleteAnnouncement(id, req.user);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
