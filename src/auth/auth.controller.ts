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

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() credentials: any) {
    console.log("Login attempt:", credentials.email);
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password
    );
    if (!user) {
      console.log("Login failed for:", credentials.email);
      return { error: "Invalid credentials" };
    }
    console.log("Login success for:", credentials.email);
    return this.authService.login(user);
  }

  @Post("register")
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("fcm-token")
  async updateFcmToken(@Request() req, @Body("token") token: string) {
    await this.authService.updateFcmToken(req.user.id, token);
    return { message: "Token enregistré" };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("user")
  getUser(@Request() req) {
    return req.user;
  }
}
