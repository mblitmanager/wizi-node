import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Param,
  Body,
  NotFoundException,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { StagiaireService } from "./stagiaire.service";
import { InscriptionService } from "../inscription/inscription.service";
import { RankingService } from "../ranking/ranking.service";

@Controller("stagiaire")
export class StagiaireController {
  constructor(
    private stagiaireService: StagiaireService,
    private inscriptionService: InscriptionService,
    private rankingService: RankingService
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("progress")
  async getProgress(@Request() req) {
    return this.rankingService.getMyRanking(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  async getProfile(@Request() req) {
    try {
      return await this.stagiaireService.getDetailedProfile(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("test-auth")
  async testAuth() {
    return { message: "Public endpoint works" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard/home")
  async getHomeData(@Request() req) {
    try {
      return await this.stagiaireService.getHomeData(req.user.id);
    } catch (error) {
      console.error("Error in getHomeData:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts")
  async getContacts(@Request() req) {
    try {
      const data = await this.stagiaireService.getContacts(req.user.id);
      return data;
    } catch (error) {
      console.error("Error in getContacts:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/commerciaux")
  async getCommerciaux(@Request() req) {
    try {
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "commercial"
      );
      return contacts;
    } catch (error) {
      console.error("Error in getCommerciaux:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/formateurs")
  async getFormateurs(@Request() req) {
    try {
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "formateur"
      );
      return contacts;
    } catch (error) {
      console.error("Error in getFormateurs:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-relation")
  async getPoleRelation(@Request() req) {
    try {
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-relation"
      );
      return contacts;
    } catch (error) {
      console.error("Error in getPoleRelation:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("contacts/pole-save")
  async getPoleSave(@Request() req) {
    try {
      const contacts = await this.stagiaireService.getContactsByType(
        req.user.id,
        "pole-save"
      );
      return contacts;
    } catch (error) {
      console.error("Error in getPoleSave:", error);
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("quizzes")
  async getMyQuizzes(@Request() req) {
    return this.stagiaireService.getStagiaireQuizzes(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/formations")
  async getStagiaireFormations(@Param("id") id: number) {
    try {
      return await this.stagiaireService.getFormationsByStagiaire(id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("inscription-catalogue-formation")
  async inscrireAFormation(
    @Request() req,
    @Body("catalogue_formation_id") catalogueFormationId: number
  ) {
    try {
      return await this.inscriptionService.inscrire(
        req.user.id,
        catalogueFormationId
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("partner")
  async getMyPartner(@Request() req) {
    try {
      return await this.stagiaireService.getMyPartner(req.user.id);
    } catch (error) {
      console.error("Error in getMyPartner:", error);
      throw new HttpException(
        error.message || "Internal error",
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-password")
  async updatePassword(@Request() req, @Body() data: any) {
    try {
      const success = await this.stagiaireService.updatePassword(
        req.user.id,
        data
      );
      return { success };
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("onboarding-seen")
  async setOnboardingSeen(@Request() req) {
    try {
      const success = await this.stagiaireService.setOnboardingSeen(
        req.user.id
      );
      return { success };
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("online-users")
  async getOnlineUsers() {
    try {
      return await this.stagiaireService.getOnlineUsers();
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("profile-photo")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./public/uploads/users",
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async uploadProfilePhoto(@Request() req, @UploadedFile() file) {
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }
    const photoPath = `uploads/users/${file.filename}`;
    // We need updateProfilePhoto in service to save path to User entity
    try {
      await this.stagiaireService.updateProfilePhoto(req.user.id, photoPath);
      return {
        success: true,
        image: photoPath,
        image_url: `/${photoPath}`, // Placeholder for asset() equivalent
      };
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
