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
import { MailService } from "../mail/mail.service";
import { join } from "path";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role", "name", "image"], // Include name and image
      relations: ["stagiaire"],
    });

    if (user) {
      // Laravel uses $2y$ prefix for bcrypt, Node bcrypt expects $2b$
      const normalizedPassword = user.password.replace(/^\$2y\$/, "$2b$");
      if (await bcrypt.compare(pass, normalizedPassword)) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      refresh_token: "dummy-refresh-token",
      user: {
        ...user,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      },
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
    } as any) as unknown as User;

    await this.userRepository.save(user);
    const { password, ...result } = user as any;

    // Send welcome email
    try {
      await this.mailService.sendMail(
        (user as User).email,
        "Bienvenue sur Wizi Learn",
        "welcome",
        { name: (user as User).name },
        [
          {
            filename: "aopia.png",
            path: join(process.cwd(), "src/mail/templates/assets/aopia.png"),
            cid: "aopia",
          },
          {
            filename: "like.png",
            path: join(process.cwd(), "src/mail/templates/assets/like.png"),
            cid: "like",
          },
        ]
      );
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError);
    }

    return result;
  }

  async updateFcmToken(userId: number, token: string) {
    await this.userRepository.update(userId, { fcm_token: token });
  }

  async logout(userId: number) {
    // Clear last_activity_at or fcm_token if needed
    // In a stateless JWT system, client just deletes the token
    // But we can clear the fcm_token if the user logs out
    await this.userRepository.update(userId, { fcm_token: null });
    return true;
  }

  async logoutAll(userId: number) {
    await this.userRepository.update(userId, { fcm_token: null });
    return true;
  }
}
