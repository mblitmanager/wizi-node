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
import { LoginHistory } from "../entities/login-history.entity";
import { MailService } from "../mail/mail.service";
import { join } from "path";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    private jwtService: JwtService,
    private mailService: MailService,
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

  async login(user: any, req?: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const now = new Date();

    // Persist login time and online status
    await this.userRepository.update(user.id, {
      last_login_at: now,
      is_online: true,
      last_activity_at: now,
    });

    // Create login history record
    if (req) {
      try {
        const userAgent = req.headers["user-agent"] || "";
        const ip =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.ip;

        await this.loginHistoryRepository.save({
          user_id: user.id,
          ip_address: typeof ip === "string" ? ip : JSON.stringify(ip),
          device: userAgent.substring(0, 255), // Simple truncation
          browser: userAgent.includes("Chrome")
            ? "Chrome"
            : userAgent.includes("Firefox")
              ? "Firefox"
              : "Other",
          platform: userAgent.includes("Windows")
            ? "Windows"
            : userAgent.includes("Mac")
              ? "MacOS"
              : "Mobile",
          login_at: now,
        });
      } catch (e) {
        console.error(
          "Failed to log login history (schema may missing):",
          e.message,
        );
      }
    }

    return {
      token: this.jwtService.sign(payload),
      refresh_token: "dummy-refresh-token",
      ...this.transformUser(user),
    };
  }

  transformUser(user: any) {
    if (!user) return null;

    const formatDate = (date: any) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate(),
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const formatIso = (date: any) => {
      if (!date) return null;
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().replace(".000Z", ".000000Z");
      } catch (e) {
        return null;
      }
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
        ],
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
    await this.userRepository.update(userId, {
      fcm_token: null,
      is_online: false,
    });
    return true;
  }

  async logoutAll(userId: number) {
    await this.userRepository.update(userId, { fcm_token: null });
    return true;
  }
}
