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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const user_entity_1 = require("../entities/user.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
let AdminService = class AdminService {
    constructor(stagiaireRepository, userRepository, quizParticipationRepository, formateurRepository, formationRepository) {
        this.stagiaireRepository = stagiaireRepository;
        this.userRepository = userRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.formateurRepository = formateurRepository;
        this.formationRepository = formationRepository;
    }
    async getFormateurDashboardStats(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur)
            return null;
        const stagiaires = formateur.stagiaires;
        const totalStagiaires = stagiaires.length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const activeThisWeek = stagiaires.filter((s) => s.user?.last_activity_at && s.user.last_activity_at > weekAgo).length;
        const neverConnected = stagiaires.filter((s) => !s.user?.last_login_at).length;
        const inactiveCount = totalStagiaires - activeThisWeek;
        const userIds = stagiaires
            .map((s) => s.user_id)
            .filter((id) => id !== null);
        let avgScore = 0;
        if (userIds.length > 0) {
            const participations = await this.quizParticipationRepository.find({
                where: { user_id: (0, typeorm_2.In)(userIds) },
            });
            if (participations.length > 0) {
                avgScore =
                    participations.reduce((acc, p) => acc + (p.score || 0), 0) /
                        participations.length;
            }
        }
        return {
            total_stagiaires: totalStagiaires,
            active_this_week: activeThisWeek,
            inactive_count: inactiveCount,
            never_connected: neverConnected,
            avg_quiz_score: parseFloat(avgScore.toFixed(1)),
            total_formations: 0,
            total_quizzes_taken: 0,
            total_video_hours: 0,
            formations: { data: [] },
            formateurs: { data: [] },
        };
    }
    async getOnlineStagiaires() {
        return this.stagiaireRepository.find({
            where: { user: { is_online: true } },
            relations: [
                "user",
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
            ],
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(3, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(4, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map