import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChallengeService } from "./challenge.service";

@Controller("challenge")
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("config")
  async getConfig() {
    try {
      return await this.challengeService.getChallengeConfig();
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("leaderboard")
  async getLeaderboard() {
    try {
      return await this.challengeService.getLeaderboard();
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("entries")
  async getEntries(@Request() req) {
    try {
      return await this.challengeService.getChallengeEntries(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || "Internal error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
