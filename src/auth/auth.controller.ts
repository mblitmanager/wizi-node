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

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() credentials: any) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password
    );
    if (!user) {
      return { error: "Invalid credentials" };
    }
    return this.authService.login(user);
  }

  @Post("register")
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
