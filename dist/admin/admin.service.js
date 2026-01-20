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
const notification_service_1 = require("../notification/notification.service");
let AdminService = class AdminService {
    constructor(stagiaireRepository, userRepository, quizParticipationRepository, formateurRepository, formationRepository, notificationService) {
        this.stagiaireRepository = stagiaireRepository;
        this.userRepository = userRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.formateurRepository = formateurRepository;
        this.formationRepository = formationRepository;
        this.notificationService = notificationService;
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
        console.log("getFormateurStagiairesPerformance called with userId:", userId);
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur) {
            console.log("Formateur not found for userId:", userId);
            return {
                performance: [],
                rankings: { most_quizzes: [], most_active: [] },
            };
        }
        const formateurId = formateur.id;
        console.log("Found Formateur ID:", formateurId);
        const qb = this.stagiaireRepository
            .createQueryBuilder("s")
            .innerJoin("s.user", "u")
            .innerJoin("s.formateurs", "f")
            .where("f.id = :formateurId", { formateurId })
            .select([
            "s.id",
            "s.prenom",
            "s.login_streak",
            "u.id",
            "u.name",
            "u.email",
            "u.image",
        ]);
        console.log("Stagiaire Performance SQL:", qb.getSql());
        const stagiaires = await qb.getMany();
        console.log(`Found ${stagiaires.length} stagiaires for formateur ${formateurId}`);
        if (stagiaires.length === 0) {
            return {
                performance: [],
                rankings: { most_quizzes: [], most_active: [] },
            };
        }
        const userIds = stagiaires.map((s) => s.user.id);
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
                    last_at: stat.last_at ? new Date(stat.last_at) : null,
                });
            });
        }
        const performance = stagiaires.map((s) => {
            const stats = quizStats.get(s.user.id) || {
                count: 0,
                last_at: null,
            };
            return {
                id: s.id,
                name: s.user.name || `${s.prenom}`,
                email: s.user.email,
                image: s.user.image || null,
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
    async getFormateurInactiveStagiaires(userId, days = 7, scope = "all") {
        const thresholdDays = days;
        const totalStagiaires = await this.stagiaireRepository.count();
        console.log(`[DEBUG] Total Stagiaires in DB: ${totalStagiaires}`);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - thresholdDays * 24 * 60 * 60 * 1000);
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur) {
            return {
                inactive_stagiaires: [],
                count: 0,
                threshold_days: thresholdDays,
            };
        }
        const formateurId = formateur.id;
        const query = this.stagiaireRepository
            .createQueryBuilder("s")
            .innerJoin("s.user", "u");
        if (scope !== "all") {
            query
                .innerJoin("s.formateurs", "f")
                .where("f.id = :formateurId", { formateurId });
        }
        const stagiaires = await query
            .select([
            "s.id",
            "s.prenom",
            "s.user_id",
            "u.name",
            "u.email",
            "u.last_activity_at",
            "u.last_client",
        ])
            .getMany();
        const inactiveStagiaires = stagiaires
            .map((s) => {
            const lastActivityAt = s.user?.last_activity_at
                ? new Date(s.user.last_activity_at)
                : null;
            let daysSinceActivity = null;
            if (lastActivityAt) {
                const diffTime = Math.abs(now.getTime() - lastActivityAt.getTime());
                daysSinceActivity = diffTime / (1000 * 60 * 60 * 24);
            }
            return {
                id: s.id,
                prenom: s.prenom,
                nom: s.user?.name,
                email: s.user?.email,
                last_activity_at: lastActivityAt
                    ? lastActivityAt.toISOString().replace("T", " ").substring(0, 19)
                    : null,
                days_since_activity: daysSinceActivity,
                never_connected: !lastActivityAt,
                last_client: s.user?.last_client || null,
            };
        })
            .filter((s) => s.never_connected ||
            (s.days_since_activity && s.days_since_activity > thresholdDays));
        return {
            inactive_stagiaires: inactiveStagiaires,
            count: inactiveStagiaires.length,
            threshold_days: thresholdDays,
        };
    }
    async getFormateurStagiaires() {
        console.log("[DEBUG] AdminService: Fetching stagiaires...");
        const stagiaires = await this.stagiaireRepository.find({
            relations: ["user"],
        });
        console.log(`[DEBUG] AdminService: Found ${stagiaires.length} stagiaires in DB`);
        return stagiaires.map((s) => {
            const formatDate = (date) => {
                if (!date)
                    return null;
                return new Date(date).toISOString().replace("T", " ").substring(0, 19);
            };
            return {
                id: s.id,
                prenom: s.prenom,
                nom: s.user?.name || "",
                email: s.user?.email || "",
                telephone: s.telephone,
                ville: s.ville,
                last_login_at: formatDate(s.user?.last_login_at),
                last_activity_at: formatDate(s.user?.last_activity_at),
                is_online: s.user?.is_online ? 1 : 0,
                last_client: s.user?.last_client || null,
                image: s.user?.image || null,
            };
        });
    }
    async getOnlineStagiaires() {
        const stagiaires = await this.stagiaireRepository
            .createQueryBuilder("stagiaire")
            .innerJoinAndSelect("stagiaire.user", "user")
            .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
            .leftJoinAndSelect("scf.catalogue_formation", "cf")
            .where("user.is_online = :isOnline", { isOnline: true })
            .getMany();
        return stagiaires.map((s) => {
            const formatDate = (date) => {
                if (!date)
                    return null;
                return new Date(date).toISOString().replace("T", " ").substring(0, 19);
            };
            return {
                id: s.id,
                prenom: s.prenom,
                nom: s.user?.name || "",
                email: s.user?.email || "",
                avatar: s.user?.image || null,
                last_activity_at: formatDate(s.user?.last_activity_at),
                formations: (s.stagiaire_catalogue_formations || []).map((scf) => scf.catalogue_formation?.titre),
            };
        });
    }
    async getNeverConnected() {
        const stagiaires = await this.stagiaireRepository.find({
            where: { user: { last_login_at: null } },
            relations: ["user"],
        });
        return stagiaires.map((s) => ({
            id: s.id,
            prenom: s.prenom,
            nom: s.user?.name || "",
            email: s.user?.email || "",
            last_activity_at: null,
        }));
    }
    async getStagiaireStats(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!stagiaire)
            return null;
        const quizStatsRaw = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoin("qp.quiz", "q")
            .leftJoin("q.questions", "ques")
            .where("qp.user_id = :userId", { userId: stagiaire.user_id })
            .select([
            "COUNT(DISTINCT qp.id) as total_quiz",
            "AVG(qp.score) as avg_score",
            "MAX(qp.score) as best_score",
            "SUM(qp.correct_answers) as total_correct",
            "COUNT(ques.id) as total_questions",
        ])
            .getRawOne();
        const formatDate = (date) => {
            if (!date)
                return null;
            return new Date(date).toISOString().replace("T", " ").substring(0, 19);
        };
        return {
            stagiaire: {
                id: stagiaire.id,
                prenom: stagiaire.prenom,
                nom: stagiaire.user?.name ?? "N/A",
                email: stagiaire.user?.email ?? "N/A",
            },
            quiz_stats: {
                total_quiz: parseInt(quizStatsRaw.total_quiz) || 0,
                avg_score: parseFloat(quizStatsRaw.avg_score) || 0,
                best_score: parseInt(quizStatsRaw.best_score) || 0,
                total_correct: parseInt(quizStatsRaw.total_correct) || 0,
                total_questions: parseInt(quizStatsRaw.total_questions) || 0,
            },
            activity: {
                last_activity: stagiaire.user?.last_activity_at
                    ? "Récemment"
                    : "Jamais",
                last_login: formatDate(stagiaire.user?.last_login_at),
                is_online: stagiaire.user?.is_online || false,
                last_client: stagiaire.user?.last_client,
            },
        };
    }
    async getFormateurMesStagiairesRanking(userId, period = "all") {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur) {
            return {
                ranking: [],
                total_stagiaires: 0,
                period,
            };
        }
        const formateurId = formateur.id;
        const query = this.stagiaireRepository
            .createQueryBuilder("s")
            .innerJoin("s.user", "u")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", { formateurId })
            .leftJoin(quiz_participation_entity_1.QuizParticipation, "qp", "u.id = qp.user_id");
        if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query.andWhere("qp.created_at >= :weekAgo", { weekAgo });
        }
        else if (period === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query.andWhere("qp.created_at >= :monthAgo", { monthAgo });
        }
        query
            .select([
            "s.id as id",
            "s.prenom as prenom",
            "u.name as nom",
            "u.email as email",
            "u.image as image",
            "COALESCE(SUM(qp.score), 0) as total_points",
            "COUNT(DISTINCT qp.id) as total_quiz",
            "COALESCE(AVG(qp.score), 0) as avg_score",
        ])
            .groupBy("s.id")
            .addGroupBy("s.prenom")
            .addGroupBy("u.name")
            .addGroupBy("u.email")
            .addGroupBy("u.image")
            .orderBy("total_points", "DESC");
        const rawRanking = await query.getRawMany();
        const ranking = rawRanking.map((item, index) => ({
            rank: index + 1,
            id: parseInt(item.id),
            prenom: item.prenom,
            nom: item.nom,
            email: item.email,
            image: item.image,
            total_points: parseInt(item.total_points),
            total_quiz: parseInt(item.total_quiz),
            avg_score: parseFloat(parseFloat(item.avg_score).toFixed(1)),
        }));
        return {
            ranking,
            total_stagiaires: ranking.length,
        };
    }
    async getTrainerArenaRanking(period = "all", formationId) {
        const query = this.formateurRepository
            .createQueryBuilder("f")
            .innerJoin("f.user", "u")
            .leftJoin("f.stagiaires", "s")
            .leftJoin("s.user", "su")
            .leftJoin(quiz_participation_entity_1.QuizParticipation, "qp", "su.id = qp.user_id AND qp.status = 'completed'");
        if (formationId) {
            query.andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = :formationId)", { formationId });
        }
        if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query.andWhere("qp.created_at >= :weekAgo", { weekAgo });
        }
        else if (period === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query.andWhere("qp.created_at >= :monthAgo", { monthAgo });
        }
        query
            .select([
            "f.id AS id",
            "f.prenom AS prenom",
            "u.name AS nom",
            "u.image AS image",
            "COUNT(DISTINCT s.id) AS total_stagiaires",
            "COALESCE(SUM(qp.score), 0) AS total_points",
        ])
            .groupBy("f.id")
            .addGroupBy("f.prenom")
            .addGroupBy("u.name")
            .addGroupBy("u.image")
            .orderBy("total_points", "DESC");
        const trainers = await query.getRawMany();
        const result = [];
        for (const trainer of trainers) {
            const stagiairesQuery = this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.user", "su")
                .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
                formateurId: trainer.id,
            })
                .leftJoin(quiz_participation_entity_1.QuizParticipation, "qp", "su.id = qp.user_id AND qp.status = 'completed'")
                .select([
                "s.id AS id",
                "s.prenom AS prenom",
                "su.name AS nom",
                "su.image AS image",
                "COALESCE(SUM(qp.score), 0) AS points",
            ])
                .groupBy("s.id")
                .addGroupBy("s.prenom")
                .addGroupBy("su.name")
                .addGroupBy("su.image")
                .orderBy("points", "DESC");
            if (period === "week") {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                stagiairesQuery.andWhere("qp.created_at >= :weekAgo", { weekAgo });
            }
            else if (period === "month") {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                stagiairesQuery.andWhere("qp.created_at >= :monthAgo", { monthAgo });
            }
            const stagiaires = await stagiairesQuery.getRawMany();
            result.push({
                ...trainer,
                id: parseInt(trainer.id),
                total_stagiaires: parseInt(trainer.total_stagiaires),
                total_points: parseInt(trainer.total_points),
                stagiaires: stagiaires.map((s) => ({
                    ...s,
                    id: parseInt(s.id),
                    points: parseInt(s.points),
                })),
            });
        }
        return result;
    }
    async getFormateurFormations(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return [];
        const stagiaireUserIds = formateur.stagiaires
            .map((s) => s.user_id)
            .filter((id) => id != null);
        const formations = await this.formationRepository
            .createQueryBuilder("cf")
            .innerJoin("cf.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .leftJoin("cf.stagiaire_catalogue_formations", "scf")
            .select([
            "cf.id as id",
            "cf.titre as titre",
            "cf.image_url as image_url",
            "cf.tarif as tarif",
            "COUNT(DISTINCT scf.stagiaire_id) as student_count",
        ])
            .groupBy("cf.id")
            .getRawMany();
        const enrichedFormations = await Promise.all(formations.map(async (f) => {
            let analytics = { avg_score: 0, total_completions: 0 };
            if (stagiaireUserIds.length > 0) {
                const stats = await this.quizParticipationRepository
                    .createQueryBuilder("qp")
                    .innerJoin("qp.quiz", "q")
                    .where("q.formation_id = :formationId", { formationId: f.id })
                    .andWhere("qp.user_id IN (:...userIds)", {
                    userIds: stagiaireUserIds,
                })
                    .andWhere("qp.status = :status", { status: "completed" })
                    .select([
                    "AVG(qp.score) as avg_score",
                    "COUNT(qp.id) as total_completions",
                ])
                    .getRawOne();
                analytics = {
                    avg_score: Math.round((parseFloat(stats.avg_score) || 0) * 10) / 10,
                    total_completions: parseInt(stats.total_completions) || 0,
                };
            }
            return {
                id: parseInt(f.id),
                titre: f.titre,
                image_url: f.image_url,
                tarif: f.tarif,
                student_count: parseInt(f.student_count),
                ...analytics,
            };
        }));
        return enrichedFormations;
    }
    async getStagiaireFormationPerformance(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: [
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
            ],
        });
        if (!stagiaire)
            return [];
        const performance = await Promise.all(stagiaire.stagiaire_catalogue_formations.map(async (scf) => {
            const formation = scf.catalogue_formation?.formation;
            if (!formation)
                return null;
            const stats = await this.quizParticipationRepository
                .createQueryBuilder("qp")
                .innerJoin("qp.quiz", "q")
                .where("q.formation_id = :formationId", { formationId: formation.id })
                .andWhere("qp.user_id = :userId", { userId: stagiaire.user_id })
                .andWhere("qp.status = :status", { status: "completed" })
                .select([
                "AVG(qp.score) as avg_score",
                "MAX(qp.score) as best_score",
                "COUNT(qp.id) as completions",
                "MAX(qp.created_at) as last_activity",
            ])
                .getRawOne();
            return {
                id: formation.id,
                titre: formation.titre,
                image_url: formation.image,
                avg_score: Math.round((parseFloat(stats.avg_score) || 0) * 10) / 10,
                best_score: parseInt(stats.best_score) || 0,
                completions: parseInt(stats.completions) || 0,
                last_activity: stats.last_activity
                    ? new Date(stats.last_activity).toISOString()
                    : null,
            };
        }));
        return performance.filter((p) => p !== null);
    }
    async getFormateurTrends(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return { quiz_trends: [], activity_trends: [] };
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const userIds = formateur.stagiaires
            .map((s) => s.user_id)
            .filter((id) => id !== null);
        if (userIds.length === 0)
            return { quiz_trends: [], activity_trends: [] };
        const quizTrends = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .where("qp.user_id IN (:...userIds)", { userIds })
            .andWhere("qp.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
            .select([
            "DATE(qp.created_at) as date",
            "COUNT(*) as count",
            "AVG(qp.score) as avg_score",
        ])
            .groupBy("date")
            .orderBy("date")
            .getRawMany();
        const activityTrends = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .where("qp.user_id IN (:...userIds)", { userIds })
            .andWhere("qp.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
            .select([
            "DATE(qp.created_at) as date",
            "COUNT(DISTINCT qp.user_id) as count",
        ])
            .groupBy("date")
            .orderBy("date")
            .getRawMany();
        return {
            quiz_trends: quizTrends.map((t) => ({
                date: t.date,
                count: parseInt(t.count),
                avg_score: parseFloat(parseFloat(t.avg_score || 0).toFixed(1)),
            })),
            activity_trends: activityTrends.map((t) => ({
                date: t.date,
                count: parseInt(t.count),
            })),
        };
    }
    async getCommercialDashboardStats() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const totalSignups = await this.stagiaireRepository.count();
        const signupsThisMonth = await this.stagiaireRepository.count({
            where: { created_at: (0, typeorm_2.Between)(monthStart, now) },
        });
        const activeStudents = await this.userRepository.count({
            where: { last_activity_at: (0, typeorm_2.Between)(thirtyDaysAgo, now) },
        });
        const conversionRate = totalSignups > 0 ? (activeStudents / totalSignups) * 100 : 0;
        const recentSignups = await this.stagiaireRepository.find({
            relations: ["user"],
            order: { created_at: "DESC" },
            take: 10,
        });
        const topFormations = await this.formationRepository
            .createQueryBuilder("cf")
            .loadRelationCountAndMap("cf.enrollments", "cf.stagiaire_catalogue_formations")
            .orderBy("cf.enrollments", "DESC")
            .limit(5)
            .getMany();
        const topFormationsQuery = await this.formationRepository
            .createQueryBuilder("cf")
            .leftJoin("cf.stagiaire_catalogue_formations", "scf")
            .select([
            "cf.id as id",
            "cf.titre as name",
            "COUNT(scf.id) as enrollments",
            "cf.tarif as price",
        ])
            .groupBy("cf.id")
            .orderBy("enrollments", "DESC")
            .limit(5)
            .getRawMany();
        const signupTrends = await this.stagiaireRepository
            .createQueryBuilder("s")
            .where("s.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
            .select(["DATE(s.created_at) as date", "COUNT(*) as value"])
            .groupBy("date")
            .orderBy("date")
            .getRawMany();
        return {
            summary: {
                totalSignups,
                signupsThisMonth,
                activeStudents,
                conversionRate: parseFloat(conversionRate.toFixed(2)),
            },
            recentSignups: recentSignups.map((s) => ({
                id: s.id,
                name: s.user?.name || "Unknown",
                email: s.user?.email || "",
                role: s.user?.role || "stagiaire",
                created_at: s.created_at
                    .toISOString()
                    .replace("T", " ")
                    .substring(0, 19),
            })),
            topFormations: topFormationsQuery.map((f) => ({
                id: parseInt(f.id),
                name: f.name,
                enrollments: parseInt(f.enrollments),
                price: parseFloat(f.price || 0),
            })),
            signupTrends: signupTrends.map((t) => ({
                date: t.date,
                value: parseInt(t.value),
            })),
        };
    }
    async disconnectStagiaires(stagiaireIds) {
        const stagiaires = await this.stagiaireRepository.find({
            where: { id: (0, typeorm_2.In)(stagiaireIds) },
            select: ["id", "user_id"],
        });
        const userIds = stagiaires
            .map((s) => s.user_id)
            .filter((id) => id !== null);
        if (userIds.length === 0) {
            return 0;
        }
        const result = await this.userRepository.update({ id: (0, typeorm_2.In)(userIds) }, { is_online: false });
        return result.affected || 0;
    }
    async sendNotification(senderId, recipientIds, title, message) {
        console.log(`[DEBUG] AdminService: Sending notification to ${recipientIds.length} recipients...`);
        const promises = recipientIds.map(async (id) => {
            const stagiaire = await this.stagiaireRepository.findOne({
                where: { id },
                select: ["id", "user_id"],
            });
            if (stagiaire && stagiaire.user_id) {
                return this.notificationService.createNotification(stagiaire.user_id, "system", message, { type: "custom", sender_id: senderId }, title);
            }
        });
        await Promise.all(promises);
        return { success: true, count: recipientIds.length };
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
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map