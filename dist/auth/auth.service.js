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
            const normalizedPassword = user.password.replace(/^\$2y\$/, "$2b$");
            if (await bcrypt.compare(pass, normalizedPassword)) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }
    async login(user) {
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
            await this.mailService.sendMail(user.email, "Bienvenue sur Wizi Learn", "confirmation", { name: user.name });
        }
        catch (mailError) {
            console.error("Failed to send welcome email:", mailError);
        }
        return result;
    }
    async updateFcmToken(userId, token) {
        await this.userRepository.update(userId, { fcm_token: token });
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