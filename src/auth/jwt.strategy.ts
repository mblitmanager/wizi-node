import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    console.log("JWT Payload:", payload);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ["stagiaire"],
    });
    if (user) {
      // Normalize Laravel bcrypt prefix for compatibility
      user.password = user.password?.replace(/^\$2y\$/, "$2b$");
    }
    if (!user) {
      console.log("User not found for sub:", payload.sub);
      throw new UnauthorizedException();
    }
    return user;
  }
}
