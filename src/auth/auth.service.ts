import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role"], // Include password for verification
      relations: ["stagiaire"],
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(userData: any) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    const { password, ...result } = user as any;
    return result;
  }
}
