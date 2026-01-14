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
    console.log("Sending Login Response:", JSON.stringify(result, null, 2));
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
    return this.apiResponse.success(this.authService.transformUser(req.user));
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return this.apiResponse.success(this.authService.transformUser(req.user));
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("user")
  getUser(@Request() req) {
    return this.apiResponse.success(this.authService.transformUser(req.user));
  }
}
