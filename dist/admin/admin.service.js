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
        const formationsQuery = this.formationRepository
            .createQueryBuilder("cf")
            .leftJoin("cf.stagiaire_catalogue_formations", "scf")
            .leftJoin("scf.stagiaire", "s")
            .leftJoin("s.user", "u")
            .leftJoin(quiz_participation_entity_1.QuizParticipation, "qp", "u.id = qp.user_id")
            .select([
            "cf.id AS id",
            "cf.titre AS nom",
            "COUNT(DISTINCT s.id) AS total_stagiaires",
            "COUNT(DISTINCT CASE WHEN u.last_activity_at >= :weekAgo THEN s.id END) AS stagiaires_actifs",
            "COALESCE(AVG(qp.score), 0) AS score_moyen",
        ])
            .setParameter("weekAgo", weekAgo)
            .groupBy("cf.id")
            .addGroupBy("cf.titre")
            .orderBy("total_stagiaires", "DESC")
            .limit(10);
        const formationsRaw = await formationsQuery.getRawMany();
        const formateursQuery = this.formateurRepository
            .createQueryBuilder("f")
            .innerJoin("f.user", "u")
            .leftJoin("f.stagiaires", "s")
            .select([
            "f.id AS id",
            "f.prenom AS prenom",
            "u.name AS nom",
            "COUNT(DISTINCT s.id) AS total_stagiaires",
        ])
            .groupBy("f.id")
            .addGroupBy("f.prenom")
            .addGroupBy("u.name")
            .orderBy("total_stagiaires", "DESC")
            .limit(5);
        const formateursRaw = await formateursQuery.getRawMany();
        const totalCatalogFormations = await this.formationRepository.count();
        const totalFormateursCount = await this.formateurRepository.count();
        const distinctFormationsResult = await this.formationRepository
            .createQueryBuilder("cf")
            .innerJoin("cf.stagiaire_catalogue_formations", "scf")
            .innerJoin("scf.stagiaire", "s")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .select("COUNT(DISTINCT cf.id)", "cnt")
            .getRawOne();
        const totalFormations = parseInt(distinctFormationsResult.cnt);
        let totalQuizzesTaken = 0;
        if (userIds.length > 0) {
            totalQuizzesTaken = await this.quizParticipationRepository.count({
                where: { user_id: (0, typeorm_2.In)(userIds) },
            });
        }
        return {
            total_stagiaires: totalStagiaires,
            active_this_week: activeThisWeek,
            inactive_count: inactiveCount,
            never_connected: neverConnected,
            avg_quiz_score: parseFloat(avgScore.toFixed(1)),
            total_formations: totalFormations,
            total_quizzes_taken: totalQuizzesTaken,
            total_video_hours: 0,
            formations: {
                data: formationsRaw.map((f) => ({
                    id: f.id,
                    nom: f.nom,
                    total_stagiaires: parseInt(f.total_stagiaires),
                    stagiaires_actifs: parseInt(f.stagiaires_actifs),
                    score_moyen: parseFloat(f.score_moyen).toFixed(4),
                })),
                current_page: 1,
                first_page_url: "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
                from: 1,
                last_page: Math.ceil(totalCatalogFormations / 10),
                last_page_url: `http://127.0.0.1:3000/api/formateur/dashboard/stats?page=${Math.ceil(totalCatalogFormations / 10)}`,
                links: [],
                next_page_url: totalCatalogFormations > 10
                    ? "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=2"
                    : null,
                path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
                per_page: 10,
                prev_page_url: null,
                to: formationsRaw.length,
                total: totalCatalogFormations,
            },
            formateurs: {
                data: formateursRaw.map((f) => ({
                    id: f.id,
                    prenom: f.prenom,
                    nom: f.nom,
                    total_stagiaires: parseInt(f.total_stagiaires),
                })),
                current_page: 1,
                first_page_url: "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
                from: 1,
                last_page: Math.ceil(totalFormateursCount / 5),
                last_page_url: `http://127.0.0.1:3000/api/formateur/dashboard/stats?page=${Math.ceil(totalFormateursCount / 5)}`,
                links: [],
                next_page_url: totalFormateursCount > 5
                    ? "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=2"
                    : null,
                path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
                per_page: 5,
                prev_page_url: null,
                to: formateursRaw.length,
                total: totalFormateursCount,
            },
        };
    }
    async getFormateurStagiairesPerformance(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur) {
            return {
                performance: [],
                rankings: { most_quizzes: [], most_active: [] },
            };
        }
        const stagiaires = formateur.stagiaires;
        const userIds = stagiaires
            .map((s) => s.user_id)
            .filter((id) => id !== null);
        let quizStats = new Map();
        if (userIds.length > 0) {
            const stats = await this.quizParticipationRepository
                .createQueryBuilder("qp")
                .select("qp.user_id", "user_id")
                .addSelect("COUNT(qp.id)", "count")
                .addSelect("MAX(qp.created_at)", "last_at")
                .where("qp.user_id IN (:...userIds)", { userIds })
                .groupBy("qp.user_id")
                .getRawMany();
            stats.forEach((stat) => {
                quizStats.set(stat.user_id, {
                    count: parseInt(stat.count),
                    last_at: new Date(stat.last_at),
                });
            });
        }
        const performance = stagiaires.map((s) => {
            const stats = quizStats.get(s.user_id) || { count: 0, last_at: null };
            return {
                id: s.id,
                name: s.user?.name || `${s.prenom} ${s.nom || ""}`,
                email: s.user?.email || s.email,
                image: s.user?.image || null,
                last_quiz_at: stats.last_at
                    ? new Date(stats.last_at.getTime() + 3 * 60 * 60 * 1000)
                        .toISOString()
                        .replace("T", " ")
                        .substring(0, 19)
                    : null,
                total_quizzes: stats.count,
                total_logins: s.login_streak || 0,
            };
        });
        const mostQuizzes = [...performance]
            .sort((a, b) => b.total_quizzes - a.total_quizzes)
            .slice(0, 5);
        const mostActive = [...performance]
            .sort((a, b) => b.total_logins - a.total_logins)
            .slice(0, 5);
        return {
            performance,
            rankings: {
                most_quizzes: mostQuizzes,
                most_active: mostActive,
            },
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