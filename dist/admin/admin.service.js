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
const classement_entity_1 = require("../entities/classement.entity");
const notification_service_1 = require("../notification/notification.service");
const formation_entity_1 = require("../entities/formation.entity");
const media_entity_1 = require("../entities/media.entity");
const media_stagiaire_entity_1 = require("../entities/media-stagiaire.entity");
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const parrainage_entity_1 = require("../entities/parrainage.entity");
const login_history_entity_1 = require("../entities/login-history.entity");
let AdminService = class AdminService {
    constructor(stagiaireRepository, userRepository, quizParticipationRepository, formateurRepository, catalogueFormationRepository, formationRepository, mediaRepository, mediaStagiaireRepository, stagiaireCatalogueFormationRepository, classementRepository, quizRepository, demandeInscriptionRepository, parrainageRepository, loginHistoryRepository, notificationService) {
        this.stagiaireRepository = stagiaireRepository;
        this.userRepository = userRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.formateurRepository = formateurRepository;
        this.catalogueFormationRepository = catalogueFormationRepository;
        this.formationRepository = formationRepository;
        this.mediaRepository = mediaRepository;
        this.mediaStagiaireRepository = mediaStagiaireRepository;
        this.stagiaireCatalogueFormationRepository = stagiaireCatalogueFormationRepository;
        this.classementRepository = classementRepository;
        this.quizRepository = quizRepository;
        this.demandeInscriptionRepository = demandeInscriptionRepository;
        this.parrainageRepository = parrainageRepository;
        this.loginHistoryRepository = loginHistoryRepository;
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
        let totalQuizzesTaken = 0;
        if (userIds.length > 0) {
            const bestScores = await this.classementRepository
                .createQueryBuilder("c")
                .innerJoin("c.stagiaire", "s")
                .where("s.user_id IN (:...userIds)", { userIds })
                .select("c.quiz_id", "quiz_id")
                .addSelect("MAX(c.points)", "best_points")
                .groupBy("s.user_id")
                .addGroupBy("c.quiz_id")
                .getRawMany();
            if (bestScores.length > 0) {
                avgScore =
                    bestScores.reduce((acc, c) => acc + (parseInt(c.best_points) || 0), 0) / bestScores.length;
                totalQuizzesTaken = bestScores.length;
            }
        }
        const formationsQuery = this.catalogueFormationRepository
            .createQueryBuilder("cf")
            .innerJoin("cf.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .leftJoin("cf.stagiaire_catalogue_formations", "scf")
            .leftJoin("scf.stagiaire", "s")
            .leftJoin("s.user", "u")
            .leftJoin(classement_entity_1.Classement, "c", "s.id = c.stagiaire_id")
            .select([
            "cf.id AS id",
            "cf.titre AS nom",
            "COUNT(DISTINCT s.id) AS total_stagiaires",
            "COUNT(DISTINCT CASE WHEN u.last_activity_at >= :weekAgo THEN s.id END) AS stagiaires_actifs",
            "COALESCE(AVG(c.points), 0) AS score_moyen",
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
        const totalCatalogFormations = await this.catalogueFormationRepository.count();
        const totalFormateursCount = await this.formateurRepository.count();
        const distinctFormationsResult = await this.catalogueFormationRepository
            .createQueryBuilder("cf")
            .innerJoin("cf.stagiaire_catalogue_formations", "scf")
            .innerJoin("scf.stagiaire", "s")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .select("COUNT(DISTINCT cf.id)", "cnt")
            .getRawOne();
        const totalFormations = parseInt(distinctFormationsResult.cnt);
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
                    title: f.nom,
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
            const stats = await this.classementRepository
                .createQueryBuilder("c")
                .innerJoin("c.stagiaire", "s")
                .select("s.user_id", "user_id")
                .addSelect("COUNT(c.id)", "count")
                .addSelect("MAX(c.updated_at)", "last_at")
                .where("s.user_id IN (:...userIds)", { userIds })
                .groupBy("s.user_id")
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
                prenom: s.prenom,
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
            .innerJoinAndSelect("s.user", "u");
        if (scope !== "all") {
            const directStagiaireIds = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.formateurs", "f")
                .where("f.id = :formateurId", { formateurId })
                .select("s.id")
                .getMany()
                .then((list) => list.map((item) => item.id));
            const formationStagiaireIds = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .innerJoin("scf.catalogue_formation", "cf")
                .innerJoin("cf.formateurs", "f")
                .where("f.id = :formateurId", { formateurId })
                .select("s.id")
                .getMany()
                .then((list) => list.map((item) => item.id));
            const allMyStagiaireIds = [
                ...new Set([...directStagiaireIds]),
            ];
            console.log(`[DEBUG] Formateur ${formateurId}: Direct Students: ${directStagiaireIds.length}, Formation Students: ${formationStagiaireIds.length}, Total Unique: ${allMyStagiaireIds.length}`);
            console.log(`[DEBUG] IDs: ${JSON.stringify(allMyStagiaireIds)}`);
            if (allMyStagiaireIds.length > 0) {
                query.andWhere("s.id IN (:...allMyStagiaireIds)", {
                    allMyStagiaireIds,
                });
            }
            else {
                console.log("[DEBUG] No students found, returning empty object.");
                return {
                    inactive_stagiaires: [],
                    count: 0,
                    threshold_days: thresholdDays,
                };
            }
        }
        const stagiaires = await query.getMany();
        console.log(`[DEBUG] Found ${stagiaires.length} potential stagiaires for scope ${scope}`);
        const inactiveStagiaires = stagiaires
            .map((s) => {
            const timestamps = [
                s.user?.last_activity_at
                    ? new Date(s.user.last_activity_at).getTime()
                    : 0,
                s.user?.last_login_at ? new Date(s.user.last_login_at).getTime() : 0,
            ].filter((t) => t > 0);
            const lastActiveTime = timestamps.length > 0 ? Math.max(...timestamps) : null;
            const lastActivityAt = lastActiveTime ? new Date(lastActiveTime) : null;
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
    async getFormateurOnlineStagiaires(userId) {
        try {
            const formateur = await this.formateurRepository.findOne({
                where: { user_id: userId },
            });
            if (!formateur) {
                console.log("Formateur not found for userId:", userId);
                return [];
            }
            console.log("Found formateur:", formateur.id);
            const stagiaires = await this.stagiaireRepository
                .createQueryBuilder("stagiaire")
                .innerJoinAndSelect("stagiaire.user", "user")
                .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
                .leftJoinAndSelect("scf.catalogue_formation", "cf")
                .innerJoin("stagiaire.formateurs", "formateur", "formateur.id = :formateurId", { formateurId: formateur.id })
                .where("user.is_online = :isOnline", { isOnline: true })
                .orderBy("stagiaire.prenom", "ASC")
                .getMany();
            console.log("Found online stagiaires:", stagiaires.length);
            return stagiaires.map((s) => {
                const formatDate = (date) => {
                    if (!date)
                        return null;
                    return new Date(date)
                        .toISOString()
                        .replace("T", " ")
                        .substring(0, 19);
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
        catch (error) {
            console.error("Error fetching formateur online stagiaires:", error);
            return [];
        }
    }
    async getFormateurStagiaires(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur) {
            return [];
        }
        const stagiaires = await this.stagiaireRepository
            .createQueryBuilder("stagiaire")
            .innerJoinAndSelect("stagiaire.user", "user")
            .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
            .leftJoinAndSelect("scf.catalogue_formation", "cf")
            .innerJoin("stagiaire.formateurs", "formateur", "formateur.id = :formateurId", { formateurId: formateur.id })
            .orderBy("stagiaire.prenom", "ASC")
            .getMany();
        return stagiaires.map((s) => ({
            id: s.id,
            prenom: s.prenom,
            nom: s.user?.name || "",
            email: s.user?.email || "",
            avatar: s.user?.image || null,
            last_activity_at: s.user?.last_activity_at
                ? new Date(s.user.last_activity_at)
                    .toISOString()
                    .replace("T", " ")
                    .substring(0, 19)
                : null,
            formations: (s.stagiaire_catalogue_formations || []).map((scf) => scf.catalogue_formation?.titre),
        }));
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
            return { ranking: [], total_stagiaires: 0, period };
        }
        const formateurId = formateur.id;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const queryBuilder = this.classementRepository
            .createQueryBuilder("c")
            .innerJoin("c.stagiaire", "s")
            .innerJoin("s.user", "u")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", { formateurId });
        if (period === "week") {
            queryBuilder.andWhere("c.updated_at >= :weekAgo", { weekAgo });
        }
        else if (period === "month") {
            queryBuilder.andWhere("c.updated_at >= :monthAgo", { monthAgo });
        }
        const rawRanking = await queryBuilder
            .select([
            "s.id as id",
            "s.prenom as prenom",
            "u.name as nom",
            "u.email as email",
            "u.image as image",
            "COALESCE(SUM(c.points), 0) as total_points",
            "COUNT(DISTINCT c.quiz_id) as total_quiz",
            "COALESCE(AVG(c.points), 0) as avg_score",
        ])
            .groupBy("s.id")
            .addGroupBy("s.prenom")
            .addGroupBy("u.name")
            .addGroupBy("u.email")
            .addGroupBy("u.image")
            .orderBy("total_points", "DESC")
            .getRawMany();
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
        const trainers = await this.formateurRepository.find({
            relations: ["user"],
        });
        const result = [];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        for (const f of trainers) {
            const stagiairesQuery = this.classementRepository
                .createQueryBuilder("c")
                .innerJoin("c.stagiaire", "s")
                .innerJoin("s.user", "su")
                .innerJoin("s.formateurs", "form", "form.id = :formateurId", {
                formateurId: f.id,
            });
            if (formationId) {
                stagiairesQuery
                    .innerJoin("c.quiz", "q")
                    .andWhere("q.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)", { cid: formationId });
            }
            if (period === "week") {
                stagiairesQuery.andWhere("c.updated_at >= :weekAgo", { weekAgo });
            }
            else if (period === "month") {
                stagiairesQuery.andWhere("c.updated_at >= :monthAgo", { monthAgo });
            }
            stagiairesQuery
                .select([
                "s.id AS id",
                "s.prenom AS prenom",
                "su.name AS nom",
                "su.image AS image",
                "COALESCE(SUM(c.points), 0) AS points",
            ])
                .groupBy("s.id")
                .addGroupBy("s.prenom")
                .addGroupBy("su.name")
                .addGroupBy("su.image")
                .orderBy("points", "DESC");
            const stagiairesRaw = await stagiairesQuery.getRawMany();
            const stagiaires = stagiairesRaw.map((s) => ({
                ...s,
                id: parseInt(s.id),
                points: parseInt(s.points),
            }));
            const totalPoints = stagiaires.reduce((acc, s) => acc + s.points, 0);
            result.push({
                id: f.id,
                prenom: f.prenom,
                nom: f.user?.name || "",
                image: f.user?.image,
                total_stagiaires: stagiaires.length,
                total_points: totalPoints,
                stagiaires,
            });
        }
        return result.sort((a, b) => b.total_points - a.total_points);
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
        const formations = await this.catalogueFormationRepository
            .createQueryBuilder("cf")
            .leftJoin("cf.formateurs", "f_direct")
            .leftJoin("cf.stagiaire_catalogue_formations", "scf_any")
            .leftJoin("scf_any.stagiaire", "s_any")
            .leftJoin("s_any.formateurs", "f_indirect")
            .where("(f_direct.id = :formateurId OR f_indirect.id = :formateurId)", {
            formateurId: formateur.id,
        })
            .leftJoin("cf.formation", "real_formation")
            .leftJoin("cf.stagiaire_catalogue_formations", "scf")
            .select([
            "cf.id as id",
            "cf.titre as titre",
            "cf.titre as nom",
            "cf.image_url as image_url",
            "cf.tarif as tarif",
            "real_formation.id as formation_id",
            "real_formation.titre as formation_titre",
            "COUNT(DISTINCT scf.stagiaire_id) as student_count",
        ])
            .groupBy("cf.id")
            .addGroupBy("real_formation.id")
            .addGroupBy("real_formation.titre")
            .addGroupBy("cf.titre")
            .addGroupBy("cf.image_url")
            .addGroupBy("cf.tarif")
            .getRawMany();
        const enrichedFormations = await Promise.all(formations.map(async (f) => {
            let analytics = { avg_score: 0, total_completions: 0 };
            if (stagiaireUserIds.length > 0) {
                const targetFormationId = f.formation_id;
                if (targetFormationId) {
                    const stats = await this.quizParticipationRepository
                        .createQueryBuilder("qp")
                        .innerJoin("qp.quiz", "q")
                        .where("q.formation_id = :formationId", {
                        formationId: targetFormationId,
                    })
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
            }
            return {
                id: parseInt(f.id),
                titre: f.titre,
                image_url: f.image_url,
                tarif: f.tarif,
                formation_id: f.formation_id ? parseInt(f.formation_id) : null,
                formation_titre: f.formation_titre,
                student_count: parseInt(f.student_count),
                ...analytics,
            };
        }));
        return enrichedFormations;
    }
    async getFormateurAvailableFormations() {
        const formations = await this.catalogueFormationRepository.find({
            where: { statut: 1 },
            relations: ["formation"],
            order: { titre: "ASC" },
        });
        return formations.map((f) => ({
            id: f.id,
            titre: f.titre,
            description: f.description,
            duree: f.duree,
            image_url: f.image_url,
            tarif: f.tarif,
            categorie: f.formation?.categorie || "Général",
            formation_id: f.formation_id,
        }));
    }
    async getFormationStats(catalogueFormationId, userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return null;
        const catalogueFormation = await this.catalogueFormationRepository.findOne({
            where: { id: catalogueFormationId },
            relations: ["formation"],
        });
        if (!catalogueFormation)
            return null;
        const stagiaires = await this.stagiaireRepository
            .createQueryBuilder("s")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .innerJoin("s.stagiaire_catalogue_formations", "scf", "scf.catalogue_formation_id = :cfid", { cfid: catalogueFormationId })
            .select("s.user_id")
            .getMany();
        const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);
        let stats = {
            student_count: userIds.length,
            avg_score: 0,
            total_completions: 0,
        };
        if (userIds.length > 0 && catalogueFormation.formation_id) {
            const qpStats = await this.quizParticipationRepository
                .createQueryBuilder("qp")
                .innerJoin("qp.quiz", "q")
                .where("q.formation_id = :fid", {
                fid: catalogueFormation.formation_id,
            })
                .andWhere("qp.user_id IN (:...uids)", { uids: userIds })
                .andWhere("qp.status = :status", { status: "completed" })
                .select([
                "AVG(qp.score) as avg_score",
                "COUNT(qp.id) as total_completions",
            ])
                .getRawOne();
            stats.avg_score =
                Math.round((parseFloat(qpStats.avg_score) || 0) * 10) / 10;
            stats.total_completions = parseInt(qpStats.total_completions) || 0;
        }
        return {
            id: catalogueFormation.id,
            titre: catalogueFormation.titre,
            ...stats,
        };
    }
    async getUnassignedStagiaires(catalogueFormationId, userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur)
            return [];
        const assignedStagiaires = await this.stagiaireCatalogueFormationRepository
            .createQueryBuilder("scf")
            .where("scf.catalogue_formation_id = :cfid", {
            cfid: catalogueFormationId,
        })
            .select("scf.stagiaire_id")
            .getMany();
        const assignedIds = assignedStagiaires.map((s) => s.stagiaire_id);
        return (formateur.stagiaires || [])
            .filter((s) => !assignedIds.includes(s.id))
            .map((s) => ({
            id: s.id,
            prenom: s.prenom,
            nom: s.user?.name || "",
            email: s.user?.email || "",
        }));
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
    async getMyStagiairesRanking(userId, period = "all") {
        return this.getFormateurMesStagiairesRanking(userId, period);
    }
    async getRankingByFormation(catalogueFormationId, period = "all") {
        const cf = await this.catalogueFormationRepository.findOne({
            where: { id: catalogueFormationId },
        });
        if (!cf || !cf.formation_id)
            return [];
        const quizzes = await this.quizRepository.find({
            where: { formation_id: cf.formation_id },
            select: ["id"],
        });
        const quizIds = quizzes.map((q) => q.id);
        if (quizIds.length === 0)
            return [];
        const qb = this.classementRepository
            .createQueryBuilder("c")
            .innerJoin("c.stagiaire", "s")
            .innerJoin("s.user", "u")
            .select([
            "s.id as id",
            "s.prenom as prenom",
            "u.name as nom",
            "u.email as email",
            "SUM(c.points) as total_points",
            "COUNT(c.id) as total_quiz",
            "AVG(c.points) as avg_score",
        ])
            .where("c.quiz_id IN (:...quizIds)", { quizIds });
        const ranking = await qb
            .groupBy("s.id")
            .addGroupBy("s.prenom")
            .addGroupBy("u.name")
            .addGroupBy("u.email")
            .orderBy("total_points", "DESC")
            .getRawMany();
        return ranking.map((r, index) => ({
            rank: index + 1,
            id: parseInt(r.id),
            prenom: r.prenom,
            nom: r.nom,
            email: r.email,
            total_points: parseInt(r.total_points),
            total_quiz: parseInt(r.total_quiz),
            avg_score: Math.round(parseFloat(r.avg_score)),
        }));
    }
    async getFormateurAnalyticsDashboard(userId, period = 30, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return null;
        let stagiaireIds = formateur.stagiaires.map((s) => s.id);
        if (formationId) {
            const formationStagiaires = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .where("scf.catalogue_formation_id = :formationId", { formationId })
                .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
                .select("s.id")
                .getMany();
            stagiaireIds = formationStagiaires.map((s) => s.id);
        }
        if (stagiaireIds.length === 0) {
            return {
                period_days: period,
                summary: {
                    total_stagiaires: 0,
                    active_stagiaires: 0,
                    total_completions: 0,
                    average_score: 0,
                    trend_percentage: 0,
                },
            };
        }
        const activeStagiaires = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("DISTINCT qp.stagiaire_id")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
            .getRawMany();
        const totalCompletionsQuery = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        });
        if (formationId) {
            totalCompletionsQuery.andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))", { cid: formationId });
        }
        const totalCompletions = await totalCompletionsQuery.getCount();
        const avgScoreQuery = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("AVG(qp.score)", "avg_score")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        });
        if (formationId) {
            avgScoreQuery.andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))", { cid: formationId });
        }
        const avgScoreResult = await avgScoreQuery.getRawOne();
        const previousCompletionsQuery = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY) AND qp.created_at < DATE_SUB(NOW(), INTERVAL :prevDays DAY)", { days: period * 2, prevDays: period });
        if (formationId) {
            previousCompletionsQuery.andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))", { cid: formationId });
        }
        const previousCompletions = await previousCompletionsQuery.getCount();
        const trend = previousCompletions > 0
            ? Math.round(((totalCompletions - previousCompletions) / previousCompletions) *
                1000) / 10
            : 0;
        return {
            period_days: period,
            summary: {
                total_stagiaires: stagiaireIds.length,
                active_stagiaires: activeStagiaires.length,
                total_completions: totalCompletions,
                average_score: Math.round((avgScoreResult?.avg_score || 0) * 10) / 10,
                trend_percentage: trend,
            },
        };
    }
    async getFormateurQuizSuccessRate(userId, period = 30, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return null;
        let stagiaireIds = formateur.stagiaires.map((s) => s.id);
        if (formationId) {
            const formationStagiaires = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .where("scf.catalogue_formation_id = :formationId", { formationId })
                .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
                .select("s.id")
                .getMany();
            stagiaireIds = formationStagiaires.map((s) => s.id);
        }
        const stagiaires = await this.stagiaireRepository.find({
            where: { id: (0, typeorm_2.In)(stagiaireIds) },
            select: ["id", "user_id"],
        });
        const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);
        if (userIds.length === 0) {
            return { period_days: period, quiz_stats: [] };
        }
        const query = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoinAndSelect("qp.quiz", "quiz")
            .leftJoinAndSelect("quiz.formation", "formation")
            .where("qp.user_id IN (:...ids)", { ids: userIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        });
        if (formationId) {
            query.andWhere("quiz.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)", { cid: formationId });
        }
        const participations = await query.getMany();
        const quizStatsMap = new Map();
        participations.forEach((p) => {
            if (!quizStatsMap.has(p.quiz_id)) {
                quizStatsMap.set(p.quiz_id, {
                    quiz_id: p.quiz_id,
                    quiz_name: p.quiz.titre,
                    category: p.quiz.formation?.categorie || "Général",
                    participations: [],
                });
            }
            quizStatsMap.get(p.quiz_id).participations.push(p);
        });
        const quizStats = Array.from(quizStatsMap.values()).map((stat) => {
            const total = stat.participations.length;
            const successful = stat.participations.filter((p) => {
                const maxScore = parseInt(p.quiz.nb_points_total) || 100;
                return p.score / maxScore >= 0.5;
            }).length;
            const avgScore = stat.participations.reduce((sum, p) => sum + p.score, 0) /
                total;
            return {
                quiz_id: stat.quiz_id,
                quiz_name: stat.quiz_name,
                category: stat.category,
                total_attempts: total,
                successful_attempts: successful,
                success_rate: Math.round((successful / total) * 1000) / 10,
                average_score: Math.round(avgScore * 10) / 10,
            };
        });
        return {
            period_days: period,
            quiz_stats: quizStats,
        };
    }
    async getFormateurActivityHeatmap(userId, period = 30, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return null;
        let stagiaireIds = formateur.stagiaires.map((s) => s.id);
        if (formationId) {
            const formationStagiaires = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .where("scf.catalogue_formation_id = :formationId", { formationId })
                .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
                .select("s.id")
                .getMany();
            stagiaireIds = formationStagiaires.map((s) => s.id);
        }
        const stagiaires = await this.stagiaireRepository.find({
            where: { id: (0, typeorm_2.In)(stagiaireIds) },
            select: ["id", "user_id"],
        });
        const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);
        if (userIds.length === 0) {
            return { period_days: period, activity_by_day: [], activity_by_hour: [] };
        }
        const query = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .where("qp.user_id IN (:...ids)", { ids: userIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        });
        if (formationId) {
            query.andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid))", { cid: formationId });
        }
        const byDay = await query
            .clone()
            .select("DAYOFWEEK(qp.created_at)", "day_of_week")
            .addSelect("COUNT(*)", "activity_count")
            .groupBy("day_of_week")
            .orderBy("day_of_week", "ASC")
            .getRawMany();
        const daysLabel = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        const activityByDay = byDay.map((bd) => ({
            day: daysLabel[bd.day_of_week - 1] || "Unknown",
            activity_count: parseInt(bd.activity_count),
        }));
        const byHour = await query
            .clone()
            .select("HOUR(qp.created_at)", "hour")
            .addSelect("COUNT(*)", "activity_count")
            .groupBy("hour")
            .orderBy("hour", "ASC")
            .getRawMany();
        const activityByHour = byHour.map((bh) => ({
            hour: parseInt(bh.hour),
            activity_count: parseInt(bh.activity_count),
        }));
        return {
            period_days: period,
            activity_by_day: activityByDay,
            activity_by_hour: activityByHour,
        };
    }
    async getFormateurDropoutRate(userId, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires"],
        });
        if (!formateur)
            return null;
        let stagiaireIds = formateur.stagiaires.map((s) => s.id);
        if (formationId) {
            const formationStagiaires = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .where("scf.catalogue_formation_id = :formationId", { formationId })
                .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
                .select("s.id")
                .getMany();
            stagiaireIds = formationStagiaires.map((s) => s.id);
        }
        const stagiaires = await this.stagiaireRepository.find({
            where: { id: (0, typeorm_2.In)(stagiaireIds) },
            select: ["id", "user_id"],
        });
        const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);
        if (userIds.length === 0) {
            return { overall: {}, quiz_dropout: [] };
        }
        const query = this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoin("qp.quiz", "quiz")
            .leftJoin("quiz.formation", "formation")
            .select("qp.quiz_id", "quiz_id")
            .addSelect("quiz.titre", "quiz_name")
            .addSelect("formation.categorie", "category")
            .addSelect("COUNT(*)", "total_attempts")
            .addSelect('SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)', "completed")
            .addSelect('SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)', "abandoned")
            .where("qp.user_id IN (:...ids)", { ids: userIds });
        if (formationId) {
            query.andWhere("quiz.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)", { cid: formationId });
        }
        const quizDropout = await query.groupBy("qp.quiz_id").getRawMany();
        const dropoutStats = quizDropout
            .map((qd) => {
            const total = parseInt(qd.total_attempts);
            const completed = parseInt(qd.completed);
            const abandoned = parseInt(qd.abandoned);
            const dropoutRate = total > 0 ? Math.round((abandoned / total) * 1000) / 10 : 0;
            return {
                quiz_name: qd.quiz_name || "Unknown",
                category: qd.category || "Général",
                total_attempts: total,
                completed,
                abandoned,
                dropout_rate: dropoutRate,
            };
        })
            .sort((a, b) => b.dropout_rate - a.dropout_rate);
        const totalAttempts = dropoutStats.reduce((sum, d) => sum + d.total_attempts, 0);
        const totalCompleted = dropoutStats.reduce((sum, d) => sum + d.completed, 0);
        const totalAbandoned = dropoutStats.reduce((sum, d) => sum + d.abandoned, 0);
        return {
            overall: {
                total_attempts: totalAttempts,
                completed: totalCompleted,
                abandoned: totalAbandoned,
                dropout_rate: totalAttempts > 0
                    ? Math.round((totalAbandoned / totalAttempts) * 1000) / 10
                    : 0,
            },
            quiz_dropout: dropoutStats,
        };
    }
    async getFormateurFormationsPerformance(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["formations", "formations.stagiaire_catalogue_formations"],
        });
        if (!formateur)
            return [];
        const performance = [];
        for (const formation of formateur.formations) {
            const stagiaireIds = formation.stagiaire_catalogue_formations.map((scf) => scf.stagiaire_id);
            if (stagiaireIds.length === 0) {
                performance.push({
                    id: formation.id,
                    nom: formation.titre,
                    total_stagiaires: 0,
                    completion_rate: 0,
                    average_score: 0,
                });
                continue;
            }
            const stagiaires = await this.stagiaireRepository.find({
                where: { id: (0, typeorm_2.In)(stagiaireIds) },
                select: ["id", "user_id"],
            });
            const userIds = stagiaires
                .map((s) => s.user_id)
                .filter((id) => id != null);
            if (userIds.length === 0) {
                performance.push({
                    id: formation.id,
                    nom: formation.titre,
                    title: formation.titre,
                    total_stagiaires: stagiaireIds.length,
                    completion_rate: 0,
                    average_score: 0,
                });
                continue;
            }
            const stats = await this.quizParticipationRepository
                .createQueryBuilder("qp")
                .select("COUNT(*)", "total")
                .addSelect('SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)', "completed")
                .addSelect("AVG(qp.score)", "avg_score")
                .where("qp.user_id IN (:...ids)", { ids: userIds })
                .andWhere("qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = :fid)", { fid: formation.formation_id })
                .getRawOne();
            performance.push({
                id: formation.id,
                titre: formation.titre,
                image_url: formation.image_url,
                student_count: stagiaireIds.length,
                avg_score: Math.round((stats.avg_score || 0) * 10) / 10,
                total_completions: Number(stats.completed || 0),
            });
        }
        return performance;
    }
    async getFormateurStudentsComparison(userId, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur)
            return [];
        let stagiaires = formateur.stagiaires;
        if (formationId) {
            const formationStagiaires = await this.stagiaireRepository
                .createQueryBuilder("s")
                .innerJoin("s.stagiaire_catalogue_formations", "scf")
                .where("scf.catalogue_formation_id = :formationId", { formationId })
                .andWhere("s.id IN (:...ids)", {
                ids: stagiaires.map((s) => s.id),
            })
                .select("s.id")
                .getMany();
            const filteredIds = formationStagiaires.map((s) => s.id);
            stagiaires = stagiaires.filter((s) => filteredIds.includes(s.id));
        }
        const comparison = [];
        for (const stagiaire of stagiaires) {
            const stats = await this.quizParticipationRepository
                .createQueryBuilder("qp")
                .select("COUNT(*)", "total")
                .addSelect('SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)', "completed")
                .addSelect("AVG(qp.score)", "avg_score")
                .where("qp.user_id = :uid", { uid: stagiaire.user_id })
                .getRawOne();
            const rankingStats = await this.classementRepository
                .createQueryBuilder("c")
                .select("SUM(c.points)", "total_points")
                .where("c.stagiaire_id = :sid", { sid: stagiaire.id })
                .getRawOne();
            comparison.push({
                id: stagiaire.id,
                name: stagiaire.user?.name || stagiaire.prenom,
                prenom: stagiaire.prenom,
                nom: stagiaire.user?.name,
                email: stagiaire.user?.email,
                telephone: stagiaire.telephone,
                image: stagiaire.user?.image,
                total_quizzes: parseInt(stats.total),
                completed_quizzes: parseInt(stats.completed),
                avg_score: Math.round((stats.avg_score || 0) * 10) / 10,
                total_points: parseInt(rankingStats.total_points || 0),
                completion_rate: stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 1000) / 10
                    : 0,
            });
        }
        return comparison.sort((a, b) => b.total_points - a.total_points);
    }
    async getFormateurDashboardHome(userId, days = 7) {
        const [stats, inactiveResult, trends, progressResult] = await Promise.all([
            this.getFormateurDashboardStats(userId),
            this.getFormateurInactiveStagiaires(userId, days, "mine"),
            this.getFormateurTrends(userId),
            this.getFormateurStagiairesProgress(userId),
        ]);
        return {
            stats: stats || {
                total_stagiaires: 0,
                active_this_week: 0,
                inactive_count: 0,
                never_connected: 0,
                avg_quiz_score: 0,
                total_formations: 0,
                total_quizzes_taken: 0,
            },
            inactive_stagiaires: inactiveResult?.inactive_stagiaires || [],
            inactive_count: inactiveResult?.count || 0,
            trends: trends || { quiz_trends: [], activity_trends: [] },
            stagiaires: progressResult?.stagiaires || [],
            stagiaires_count: progressResult?.total || 0,
        };
    }
    async getFormateurFormationsWithVideos(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: [
                "formations",
                "formations.formation",
                "formations.formation.medias",
            ],
        });
        if (!formateur) {
            throw new common_1.NotFoundException(`Formateur avec l'utilisateur ID ${userId} introuvable`);
        }
        const formationsWithVideos = formateur.formations.map((catalogue) => ({
            formation_id: catalogue.id,
            formation_titre: catalogue.titre,
            videos: (catalogue.formation?.medias || [])
                .filter((media) => media.type === "video")
                .map((media) => ({
                id: media.id,
                titre: media.titre,
                description: media.description,
                url: media.video_url || media.url,
                type: media.type,
                created_at: media.created_at?.toISOString() || new Date().toISOString(),
            })),
        }));
        return formationsWithVideos;
    }
    async getFormateurStagiairesProgress(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur) {
            return { stagiaires: [], total: 0 };
        }
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const stagiaires = formateur.stagiaires.map((s) => {
            const isActive = s.user?.last_activity_at && s.user.last_activity_at > weekAgo;
            const neverConnected = !s.user?.last_login_at;
            return {
                id: s.id,
                prenom: s.prenom || "",
                nom: s.user?.name || "",
                email: s.user?.email || "",
                avatar: s.user?.image || null,
                is_active: isActive,
                never_connected: neverConnected,
                in_formation: true,
                progress: 0,
                avg_score: 0,
                modules_count: 0,
                formation: null,
                last_activity_at: s.user?.last_activity_at
                    ? new Date(s.user.last_activity_at)
                        .toISOString()
                        .replace("T", " ")
                        .substring(0, 19)
                    : null,
            };
        });
        return {
            stagiaires,
            total: stagiaires.length,
        };
    }
    async getVideoStats(videoId) {
        const media = await this.mediaRepository.findOne({
            where: { id: videoId, type: "video" },
        });
        if (!media) {
            throw new common_1.NotFoundException(`Vidéo avec l'ID ${videoId} introuvable`);
        }
        try {
            const trackings = await this.mediaStagiaireRepository.find({
                where: { media_id: videoId },
                relations: ["stagiaire", "stagiaire.user"],
            });
            const totalViews = trackings.length;
            const totalDurationWatched = trackings.reduce((acc, t) => acc + (t.current_time || 0), 0);
            const avgCompletion = totalViews > 0
                ? Math.round(trackings.reduce((acc, t) => acc + (t.percentage || 0), 0) /
                    totalViews)
                : 0;
            return {
                video_id: videoId,
                total_views: totalViews,
                total_duration_watched: totalDurationWatched,
                completion_rate: avgCompletion,
                views_by_stagiaire: trackings.map((t) => ({
                    id: t.stagiaire?.id || 0,
                    prenom: t.stagiaire?.prenom || "Stagiaire",
                    nom: t.stagiaire?.user?.name || "Inconnu",
                    completed: !!t.is_watched,
                    total_watched: t.current_time || 0,
                    percentage: t.percentage || 0,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching video stats:", error);
            return {
                video_id: videoId,
                total_views: 0,
                total_duration_watched: 0,
                completion_rate: 0,
                views_by_stagiaire: [],
            };
        }
    }
    async getStagiaireProfileById(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: [
                "user",
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
                "formateurs",
                "formateurs.user",
                "poleRelationClients",
                "poleRelationClients.user",
                "commercials",
                "commercials.user",
                "partenaire",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        const userId = stagiaire.user_id;
        const quizParticipations = await this.quizParticipationRepository.find({
            where: { user_id: userId },
            relations: ["quiz", "quiz.questions", "quiz.formation"],
            order: { created_at: "DESC" },
        });
        const completedQuizzes = quizParticipations.filter((p) => p.status === "completed");
        const classements = await this.classementRepository.find({
            where: { stagiaire_id: id },
        });
        const totalScore = classements.reduce((acc, c) => acc + (c.points || 0), 0);
        const avgScore = completedQuizzes.length > 0
            ? completedQuizzes.reduce((acc, p) => {
                const totalQ = p.quiz?.questions?.length || 10;
                const perc = ((p.correct_answers || 0) / totalQ) * 100;
                return acc + perc;
            }, 0) / completedQuizzes.length
            : 0;
        const totalTime = completedQuizzes.reduce((acc, p) => acc + (p.time_spent || 0), 0);
        const formationsCompleted = stagiaire.stagiaire_catalogue_formations.filter((scf) => scf.date_fin != null).length;
        const formationsInProgress = stagiaire.stagiaire_catalogue_formations.filter((scf) => scf.date_fin == null).length;
        let badge = "BRONZE";
        if (totalScore >= 1000)
            badge = "OR";
        else if (totalScore >= 500)
            badge = "ARGENT";
        const now = new Date();
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const dailyActions = quizParticipations.filter((p) => {
                if (!p.created_at)
                    return false;
                return p.created_at.toISOString().split("T")[0] === dateStr;
            }).length;
            last30Days.push({
                date: dateStr,
                actions: dailyActions,
            });
        }
        const recentActivities = quizParticipations.slice(0, 10).map((p) => ({
            type: "quiz",
            title: p.quiz?.titre || "Quiz",
            score: p.score,
            timestamp: p.created_at ? new Date(p.created_at).toISOString() : null,
        }));
        const formations = stagiaire.stagiaire_catalogue_formations.map((scf) => ({
            id: scf.catalogue_formation?.id,
            title: scf.catalogue_formation?.titre || "Formation",
            category: scf.catalogue_formation?.formation?.categorie || "Général",
            started_at: scf.created_at
                ? new Date(scf.created_at).toISOString()
                : null,
            completed_at: scf.date_fin ? new Date(scf.date_fin).toISOString() : null,
            progress: scf.date_fin ? 100 : 0,
        }));
        const quizHistory = completedQuizzes.map((p) => ({
            id: p.id,
            quiz_id: p.quiz_id,
            correctAnswers: p.correct_answers || 0,
            totalQuestions: p.quiz?.questions?.length || 5,
            score: p.score,
            completedAt: p.completed_at
                ? new Date(p.completed_at).toISOString()
                : p.created_at
                    ? new Date(p.created_at).toISOString()
                    : null,
            timeSpent: p.time_spent || 0,
            quiz: {
                id: p.quiz?.id,
                titre: p.quiz?.titre || "Quiz",
                niveau: p.quiz?.niveau || "débutant",
                formation: {
                    categorie: p.quiz?.formation?.categorie || "Général",
                },
            },
        }));
        return {
            stagiaire: {
                id: stagiaire.id,
                prenom: stagiaire.prenom,
                nom: stagiaire.user?.name || "",
                email: stagiaire.user?.email || "",
                telephone: stagiaire.telephone,
                image: stagiaire.user?.image,
                created_at: stagiaire.created_at
                    ? new Date(stagiaire.created_at).toISOString()
                    : null,
                date_inscription: stagiaire.date_inscription
                    ? new Date(stagiaire.date_inscription).toISOString()
                    : null,
                date_debut_formation: stagiaire.date_debut_formation
                    ? new Date(stagiaire.date_debut_formation).toISOString()
                    : null,
                last_login: stagiaire.user?.last_login_at
                    ? new Date(stagiaire.user.last_login_at).toISOString()
                    : null,
            },
            contacts: {
                formateurs: (stagiaire.formateurs || []).map((f) => ({
                    id: f.id,
                    nom: `${f.prenom || ""} ${f.user?.name || ""}`.trim() || "Formateur",
                    telephone: f.telephone,
                    email: f.user?.email,
                    image: f.user?.image,
                    civilite: f.civilite,
                })),
                pole_relation: (stagiaire.poleRelationClients || []).map((p) => ({
                    id: p.id,
                    nom: `${p.prenom || ""} ${p.user?.name || "Staff"}`.trim(),
                    telephone: p.telephone,
                    email: p.user?.email,
                    image: p.user?.image,
                    civilite: p.civilite,
                })),
                commercials: (stagiaire.commercials || []).map((c) => ({
                    id: c.id,
                    nom: `${c.prenom || ""} ${c.user?.name || ""}`.trim() || "Conseiller",
                    telephone: c.telephone,
                    email: c.user?.email,
                    image: c.user?.image,
                    civilite: c.civilite,
                })),
                partenaire: stagiaire.partenaire
                    ? {
                        id: stagiaire.partenaire.id,
                        nom: stagiaire.partenaire.identifiant || "Partenaire",
                        email: null,
                        telephone: null,
                    }
                    : null,
            },
            stats: {
                total_points: Math.round(totalScore),
                current_badge: badge,
                formations_completed: formationsCompleted,
                formations_in_progress: formationsInProgress,
                quizzes_completed: completedQuizzes.length,
                average_score: Math.round(avgScore * 10) / 10,
                total_time_minutes: Math.round(totalTime / 60),
                login_streak: stagiaire.login_streak || 0,
                last_activity: stagiaire.user?.last_activity_at
                    ? new Date(stagiaire.user.last_activity_at).toISOString()
                    : null,
            },
            quiz_stats: {
                total_quiz: completedQuizzes.length,
                avg_score: Math.round(avgScore * 10) / 10,
                best_score: completedQuizzes.reduce((max, p) => Math.max(max, p.score || 0), 0),
                total_correct: completedQuizzes.reduce((acc, p) => acc + (p.correct_answers || 0), 0),
                total_questions: completedQuizzes.reduce((acc, p) => acc + (p.quiz?.questions?.length || 10), 0),
            },
            activity: {
                last_30_days: last30Days,
                recent_activities: recentActivities,
            },
            login_history: await this.loginHistoryRepository
                .find({
                where: { user_id: userId },
                order: { login_at: "DESC" },
                take: 10,
            })
                .catch(() => []),
            video_stats: {
                total_watched: await this.mediaStagiaireRepository
                    .count({
                    where: { stagiaire_id: id, is_watched: true },
                })
                    .catch(() => 0),
                total_time_watched: await this.mediaStagiaireRepository
                    .find({
                    where: { stagiaire_id: id },
                })
                    .then((ms) => {
                    return Math.round(ms.reduce((acc, m) => acc + (m.duration || 0), 0) / 60);
                })
                    .catch(() => 0),
            },
            formations,
            quiz_history: quizHistory,
        };
    }
    async getStagiaireFullFormations(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: [
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation.medias",
                "medias",
            ],
        });
        if (!stagiaire)
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        return stagiaire.stagiaire_catalogue_formations.map((scf) => {
            const formation = scf.catalogue_formation?.formation;
            const videos = formation?.medias?.filter((m) => m.type === "video") || [];
            const totalVideos = videos.length;
            const watchedCount = stagiaire.medias?.filter((wm) => videos.some((v) => v.id === wm.id))
                .length || 0;
            return {
                id: scf.catalogue_formation?.id,
                titre: scf.catalogue_formation?.titre || "Formation",
                completions: watchedCount,
                total_videos: totalVideos,
                avg_score: scf.date_fin
                    ? 100
                    : Math.round((watchedCount / (totalVideos || 1)) * 100),
                last_activity: scf.updated_at,
                best_score: scf.date_fin ? 100 : 0,
            };
        });
    }
    async getFormateurStudentsPerformance(userId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur)
            return [];
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        if (stagiaireIds.length === 0)
            return [];
        const quizStats = await this.classementRepository
            .createQueryBuilder("c")
            .select("c.stagiaire_id", "stagiaire_id")
            .addSelect("COUNT(c.id)", "total_quizzes")
            .addSelect("SUM(c.points)", "total_points")
            .addSelect("MAX(c.created_at)", "last_quiz_at")
            .where("c.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .groupBy("c.stagiaire_id")
            .getRawMany();
        const quizStatsMap = new Map(quizStats.map((s) => [parseInt(s.stagiaire_id), s]));
        const performance = formateur.stagiaires
            .map((stagiaire) => {
            if (!stagiaire.user)
                return null;
            const stats = quizStatsMap.get(stagiaire.id);
            return {
                id: stagiaire.id,
                prenom: stagiaire.prenom,
                name: stagiaire.user.name || `${stagiaire.prenom}`,
                email: stagiaire.user.email,
                image: stagiaire.user.image,
                last_quiz_at: stats ? stats.last_quiz_at : null,
                total_quizzes: stats ? parseInt(stats.total_quizzes) : 0,
                total_points: stats
                    ? Math.round(parseFloat(stats.total_points || "0"))
                    : 0,
                total_logins: stagiaire.login_streak || 0,
            };
        })
            .filter((p) => p !== null);
        return performance;
    }
    async getFormateurFormationStagiaires(userId, formationId) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur)
            throw new common_1.NotFoundException("Formateur non trouvé");
        const formation = await this.catalogueFormationRepository.findOne({
            where: { id: formationId },
            relations: ["formation", "formation.medias"],
        });
        if (!formation)
            throw new common_1.NotFoundException("Formation introuvable");
        const stagiaires = await this.stagiaireRepository.find({
            where: {
                formateurs: { id: formateur.id },
                stagiaire_catalogue_formations: { catalogue_formation_id: formationId },
            },
            relations: ["user", "medias", "stagiaire_catalogue_formations"],
        });
        const totalVideos = formation.formation?.medias?.filter((m) => m.type === "video").length ||
            0;
        return {
            formation: {
                id: formation.id,
                titre: formation.titre,
                categorie: formation.formation?.categorie,
            },
            stagiaires: stagiaires.map((stagiaire) => {
                const watchedCount = stagiaire.medias?.filter((w) => formation.formation?.medias?.some((m) => m.id === w.id)).length || 0;
                const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
                const scf = stagiaire.stagiaire_catalogue_formations.find((s) => s.catalogue_formation_id == formationId);
                return {
                    id: stagiaire.id,
                    prenom: stagiaire.prenom,
                    nom: stagiaire.user?.name || "",
                    email: stagiaire.user?.email || "",
                    date_debut: scf?.date_debut,
                    date_fin: scf?.date_fin,
                    progress,
                    status: stagiaire.statut,
                };
            }),
        };
    }
    async assignFormateurFormationStagiaires(userId, formationId, stagiaireIds, dateDebut, dateFin) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: userId },
        });
        if (!formateur)
            throw new common_1.NotFoundException("Formateur non trouvé");
        const formation = await this.catalogueFormationRepository.findOne({
            where: { id: formationId },
        });
        if (!formation)
            throw new common_1.NotFoundException("Formation introuvable");
        const stagiaires = await this.stagiaireRepository.find({
            where: {
                id: (0, typeorm_2.In)(stagiaireIds),
                formateurs: { id: formateur.id },
            },
        });
        if (stagiaires.length !== stagiaireIds.length) {
            throw new Error("Certains stagiaires n'appartiennent pas à ce formateur");
        }
        let assigned = 0;
        for (const stagiaire of stagiaires) {
            const existing = await this.stagiaireCatalogueFormationRepository.findOne({
                where: {
                    stagiaire_id: stagiaire.id,
                    catalogue_formation_id: formationId,
                },
            });
            if (!existing) {
                const assignment = this.stagiaireCatalogueFormationRepository.create({
                    stagiaire_id: stagiaire.id,
                    catalogue_formation_id: formationId,
                    date_debut: dateDebut || new Date(),
                    date_fin: dateFin,
                    formateur_id: formateur.id,
                });
                await this.stagiaireCatalogueFormationRepository.save(assignment);
                assigned++;
            }
            else {
                if (dateDebut)
                    existing.date_debut = dateDebut;
                if (dateFin)
                    existing.date_fin = dateFin;
                await this.stagiaireCatalogueFormationRepository.save(existing);
            }
        }
        return {
            success: true,
            message: `${assigned} stagiaire(s) assigné(s) à la formation ${formation.titre}`,
            assigned_count: assigned,
        };
    }
    async getDemandesSuivi(userId, role) {
        const query = this.demandeInscriptionRepository
            .createQueryBuilder("d")
            .leftJoinAndSelect("d.filleul", "filleul")
            .leftJoinAndSelect("filleul.stagiaire", "stagiaire")
            .leftJoinAndSelect("d.formation", "formation")
            .limit(100);
        if (role === "stagiaire") {
            query.andWhere("d.filleul_id = :userId", { userId });
        }
        else if (role === "formateur" || role === "formatrice") {
            const formateur = await this.formateurRepository.findOne({
                where: { user_id: userId },
            });
            if (formateur) {
                query
                    .innerJoin(stagiaire_entity_1.Stagiaire, "s", "s.user_id = d.filleul_id")
                    .innerJoin("s.formateurs", "f", "f.id = :fId", { fId: formateur.id });
            }
        }
        else if (role === "commercial") {
            query.innerJoin("commercial", "c", "c.user_id = :userId AND d.filleul_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id)", { userId });
        }
        const demandes = await query.orderBy("d.date_demande", "DESC").getMany();
        return demandes.map((d) => ({
            id: d.id,
            date: d.date_demande,
            statut: d.statut,
            formation: d.formation?.titre || "Formation",
            stagiaire: d.filleul
                ? {
                    id: d.filleul.stagiaire?.id,
                    name: d.filleul.name,
                    prenom: d.filleul.stagiaire?.prenom,
                }
                : null,
            motif: d.motif,
        }));
    }
    async getParrainageSuivi(userId, role) {
        const query = this.parrainageRepository
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.filleul", "filleul")
            .leftJoinAndSelect("filleul.stagiaire", "stagiaire")
            .leftJoinAndSelect("p.parrain", "parrain");
        if (role === "stagiaire") {
            query.andWhere("p.parrain_id = :userId", { userId });
        }
        else if (role === "formateur" || role === "formatrice") {
            const formateur = await this.formateurRepository.findOne({
                where: { user_id: userId },
            });
            if (formateur) {
                query
                    .leftJoin(stagiaire_entity_1.Stagiaire, "s_filter", "s_filter.user_id = p.filleul_id")
                    .leftJoin("s_filter.formateurs", "f_filter")
                    .andWhere("(p.parrain_id = :userId OR f_filter.id = :fId)", {
                    userId,
                    fId: formateur.id,
                });
            }
        }
        else if (role === "commercial") {
            query.innerJoin("commercial", "c", "c.user_id = :userId AND (p.filleul_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id) OR p.parrain_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id))", { userId });
        }
        const parrainages = await query
            .orderBy("p.date_parrainage", "DESC")
            .getMany();
        return parrainages.map((p) => ({
            id: p.id,
            date: p.date_parrainage,
            points: p.points,
            gains: p.gains,
            parrain: p.parrain ? { name: p.parrain.name } : null,
            filleul: p.filleul
                ? {
                    id: p.filleul.stagiaire?.id,
                    name: p.filleul.name,
                    prenom: p.filleul.stagiaire?.prenom,
                    statut: p.filleul.stagiaire?.statut,
                }
                : null,
        }));
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
    __param(5, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(6, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(7, (0, typeorm_1.InjectRepository)(media_stagiaire_entity_1.MediaStagiaire)),
    __param(8, (0, typeorm_1.InjectRepository)(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation)),
    __param(9, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(10, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(11, (0, typeorm_1.InjectRepository)(demande_inscription_entity_1.DemandeInscription)),
    __param(12, (0, typeorm_1.InjectRepository)(parrainage_entity_1.Parrainage)),
    __param(13, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map