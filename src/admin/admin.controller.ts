import {
  Controller,
  Get,
  Render,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response as ExpressResponse } from "express";

@Controller("admin")
export class AdminController {
  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard")
  async dashboard(@Request() req: any) {
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return {
      message: "Admin Dashboard",
      user: req.user,
    };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "stagiaires" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("formations")
  async formations(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "formations" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("quiz")
  async quiz(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "quiz" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("catalogue")
  async catalogue(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "catalogue" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("formateurs")
  async formateurs(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "formateurs" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("commerciaux")
  async commerciaux(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "commerciaux" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("achievements")
  async achievements(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "achievements" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats")
  async stats(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "stats" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("parametres")
  async parametres(@Request() req: any) {
    if (req.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return { page: "parametres" };
  }
}
