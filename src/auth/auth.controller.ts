import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private apiResponse: ApiResponseService
  ) {}

  @Post("login")
  async login(@Body() credentials: any) {
    console.log("Login attempt:", credentials.email);
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password
    );
    if (!user) {
      console.log("Login failed for:", credentials.email);
      return this.apiResponse.error("Invalid credentials", 401);
    }
    console.log("Login success for:", credentials.email);
    const result = await this.authService.login(user);
    return this.apiResponse.success(result);
  }

  @Post("register")
  async register(@Body() userData: any) {
    const result = await this.authService.register(userData);
    return this.apiResponse.success(result);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return this.apiResponse.success({ message: "Success" });
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout-all")
  async logoutAll(@Request() req) {
    await this.authService.logoutAll(req.user.id);
    return this.apiResponse.success({ message: "Success" });
  }

  @Post("refresh")
  async refresh(@Body("refresh_token") refreshToken: string) {
    // Basic placeholder for frontend parity
    return this.apiResponse.success({
      access_token: "dummy-new-token",
      refresh_token: "dummy-new-refresh-token",
    });
  }

  @Post("refresh-token")
  async refreshToken(@Body("refresh_token") refreshToken: string) {
    // Alternative endpoint for token refresh (Laravel compatibility)
    return this.apiResponse.success({
      access_token: "dummy-new-token",
      refresh_token: "dummy-new-refresh-token",
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("fcm-token")
  async updateFcmToken(@Request() req, @Body("token") token: string) {
    await this.authService.updateFcmToken(req.user.id, token);
    return this.apiResponse.success({ message: "Token enregistré" });
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req) {
    return this.apiResponse.success(this.transformUser(req.user));
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return this.apiResponse.success(this.transformUser(req.user));
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("user")
  getUser(@Request() req) {
    return this.apiResponse.success(this.transformUser(req.user));
  }

  private transformUser(user: any) {
    if (!user) return null;

    const formatDate = (date: any) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const formatIso = (date: any) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().replace(".000Z", ".000000Z");
    };

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified_at: (user as any).email_verified_at || null,
      role: user.role,
      image: user.image,
      created_at: formatIso(user.created_at),
      updated_at: formatIso(user.updated_at),
      last_login_at: formatDate(user.last_login_at),
      last_activity_at: formatDate(user.last_activity_at),
      last_login_ip: user.last_login_ip,
      is_online: user.is_online ? 1 : 0,
      fcm_token: user.fcm_token,
      last_client: user.last_client,
      adresse: user.adresse,
    };

    let stagiaireData = null;
    if (user.stagiaire) {
      stagiaireData = {
        id: user.stagiaire.id,
        prenom: user.stagiaire.prenom,
        civilite: user.stagiaire.civilite,
        telephone: user.stagiaire.telephone,
        adresse: user.stagiaire.adresse,
        date_naissance: user.stagiaire.date_naissance
          ? new Date(user.stagiaire.date_naissance).toISOString().split("T")[0]
          : null,
        ville: user.stagiaire.ville,
        code_postal: user.stagiaire.code_postal,
        date_debut_formation: user.stagiaire.date_debut_formation
          ? new Date(user.stagiaire.date_debut_formation)
              .toISOString()
              .split("T")[0]
          : null,
        date_inscription: user.stagiaire.date_inscription
          ? new Date(user.stagiaire.date_inscription)
              .toISOString()
              .split("T")[0]
          : null,
        role: user.stagiaire.role,
        statut: parseInt(user.stagiaire.statut) || 1,
        user_id: user.id,
        deleted_at: (user.stagiaire as any).deleted_at || null,
        created_at: formatIso(user.stagiaire.created_at),
        updated_at: formatIso(user.stagiaire.updated_at),
        date_fin_formation: user.stagiaire.date_fin_formation
          ? new Date(user.stagiaire.date_fin_formation)
              .toISOString()
              .split("T")[0]
          : null,
        login_streak: user.stagiaire.login_streak || 0,
        last_login_at: formatDate(user.stagiaire.last_login_at),
        onboarding_seen: user.stagiaire.onboarding_seen ? 1 : 0,
        partenaire_id: user.stagiaire.partenaire_id || null,
      };
    }

    return {
      user: userData,
      stagiaire: stagiaireData,
    };
  }
}
