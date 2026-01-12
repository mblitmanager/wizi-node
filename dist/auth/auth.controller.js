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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
let AuthController = class AuthController {
    constructor(authService, apiResponse) {
        this.authService = authService;
        this.apiResponse = apiResponse;
    }
    async login(credentials) {
        console.log("Login attempt:", credentials.email);
        const user = await this.authService.validateUser(credentials.email, credentials.password);
        if (!user) {
            console.log("Login failed for:", credentials.email);
            return this.apiResponse.error("Invalid credentials", 401);
        }
        console.log("Login success for:", credentials.email);
        const result = await this.authService.login(user);
        return this.apiResponse.success(result);
    }
    async register(userData) {
        const result = await this.authService.register(userData);
        return this.apiResponse.success(result);
    }
    async logout(req) {
        await this.authService.logout(req.user.id);
        return this.apiResponse.success({ message: "Success" });
    }
    async logoutAll(req) {
        await this.authService.logoutAll(req.user.id);
        return this.apiResponse.success({ message: "Success" });
    }
    async refresh(refreshToken) {
        return this.apiResponse.success({
            access_token: "dummy-new-token",
            refresh_token: "dummy-new-refresh-token",
        });
    }
    async refreshToken(refreshToken) {
        return this.apiResponse.success({
            access_token: "dummy-new-token",
            refresh_token: "dummy-new-refresh-token",
        });
    }
    async updateFcmToken(req, token) {
        await this.authService.updateFcmToken(req.user.id, token);
        return this.apiResponse.success({ message: "Token enregistré" });
    }
    getProfile(req) {
        return this.apiResponse.success(this.transformUser(req.user));
    }
    getMe(req) {
        return this.apiResponse.success(this.transformUser(req.user));
    }
    getUser(req) {
        return this.apiResponse.success(this.transformUser(req.user));
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
            const d = new Date(date);
            if (isNaN(d.getTime()))
                return null;
            return d.toISOString().replace(".000Z", ".000000Z");
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("logout-all"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Body)("refresh_token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    __param(0, (0, common_1.Body)("refresh_token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("fcm-token"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateFcmToken", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("user"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUser", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_response_service_1.ApiResponseService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map