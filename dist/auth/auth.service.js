"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const mail_service_1 = require("../mail/mail.service");
const path_1 = require("path");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, mailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async validateUser(email, pass) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ["id", "email", "password", "role", "name", "image"],
            relations: ["stagiaire"],
        });
        if (user) {
            console.log("Login attempt for:", email);
            console.log("DB Hash:", user.password);
            const normalizedPassword = user.password.replace(/^\$2y\$/, "$2b$");
            console.log("Normalized Hash:", normalizedPassword);
            const isMatch = await bcrypt.compare(pass, normalizedPassword);
            console.log("Password Match:", isMatch);
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        }
        else {
            console.log("User not found by email:", email);
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            token: this.jwtService.sign(payload),
            refresh_token: "dummy-refresh-token",
            ...this.transformUser(user),
        };
    }
    transformUser(user) {
        if (!user)
            return null;
        const formatDate = (date) => {
            if (!date)
                return null;
            const d = new Date(date);
            if (isNaN(d.getTime()))
                return null;
            const pad = (n) => n.toString().padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };
        const formatIso = (date) => {
            if (!date)
                return null;
            try {
                const d = new Date(date);
                if (isNaN(d.getTime()))
                    return null;
                return d.toISOString().replace(".000Z", ".000000Z");
            }
            catch (e) {
                return null;
            }
        };
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            email_verified_at: user.email_verified_at || null,
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
                deleted_at: user.stagiaire.deleted_at || null,
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
    async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        try {
            await this.mailService.sendMail(user.email, "Bienvenue sur Wizi Learn", "welcome", { name: user.name }, [
                {
                    filename: "aopia.png",
                    path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/aopia.png"),
                    cid: "aopia",
                },
                {
                    filename: "like.png",
                    path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/like.png"),
                    cid: "like",
                },
            ]);
        }
        catch (mailError) {
            console.error("Failed to send welcome email:", mailError);
        }
        return result;
    }
    async updateFcmToken(userId, token) {
        await this.userRepository.update(userId, { fcm_token: token });
    }
    async logout(userId) {
        await this.userRepository.update(userId, { fcm_token: null });
        return true;
    }
    async logoutAll(userId) {
        await this.userRepository.update(userId, { fcm_token: null });
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map