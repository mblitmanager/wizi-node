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
exports.StagiaireService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const classement_entity_1 = require("../entities/classement.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const formation_entity_1 = require("../entities/formation.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const typeorm_3 = require("typeorm");
const ranking_service_1 = require("../ranking/ranking.service");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
const agenda_service_1 = require("../agenda/agenda.service");
const media_service_1 = require("../media/media.service");
let StagiaireService = class StagiaireService {
    constructor(stagiaireRepository, classementRepository, catalogueRepository, formationRepository, quizRepository, participationRepository, userRepository, rankingService, agendaService, mediaService) {
        this.stagiaireRepository = stagiaireRepository;
        this.classementRepository = classementRepository;
        this.catalogueRepository = catalogueRepository;
        this.formationRepository = formationRepository;
        this.quizRepository = quizRepository;
        this.participationRepository = participationRepository;
        this.userRepository = userRepository;
        this.rankingService = rankingService;
        this.agendaService = agendaService;
        this.mediaService = mediaService;
    }
    async getProfile(userId) {
        return this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["user"],
        });
    }
    async getHomeData(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: [
                "user",
                "formateurs",
                "formateurs.user",
                "commercials",
                "commercials.user",
                "poleRelationClients",
                "poleRelationClients.user",
            ],
        });
        if (!stagiaire) {
            return {
                user: { id: 0, prenom: "", image: null },
                quiz_stats: { total_quizzes: 0, total_points: 0, average_score: 0 },
                recent_history: [],
                contacts: { formateurs: [], commerciaux: [], pole_relation: [] },
                catalogue_formations: [],
                categories: [],
            };
        }
        const quizStats = await this.classementRepository
            .createQueryBuilder("classement")
            .select("COUNT(*)", "total_quizzes")
            .addSelect("SUM(points)", "total_points")
            .addSelect("AVG(points)", "avg_score")
            .where("classement.stagiaire_id = :id", { id: stagiaire.id })
            .getRawOne();
        const recentHistory = await this.classementRepository.find({
            where: { stagiaire_id: stagiaire.id },
            relations: ["quiz"],
            order: { updated_at: "DESC" },
            take: 3,
        });
        const mapContact = (contact, type) => ({
            id: contact?.id,
            prenom: contact?.prenom,
            nom: contact?.nom || contact?.user?.name?.split(" ").pop() || "",
            email: contact?.user?.email || contact?.email || null,
            telephone: contact?.telephone || null,
            role: contact?.role || type,
            civilite: contact?.civilite || null,
            image: contact?.user?.image || null,
            type: type,
        });
        const formateurs = (stagiaire.formateurs || []).map((c) => mapContact(c, "formateur"));
        const commerciaux = (stagiaire.commercials || []).map((c) => mapContact(c, "commercial"));
        const poleRelation = (stagiaire.poleRelationClients || []).map((c) => mapContact(c, "pole_relation_client"));
        const catalogueFormations = await this.catalogueRepository.find({
            where: { statut: 1 },
            relations: ["formation"],
            take: 3,
        });
        const categoriesRaw = await this.formationRepository
            .createQueryBuilder("formation")
            .select("DISTINCT formation.categorie", "categorie")
            .where("formation.statut = :statut", { statut: 1 })
            .getRawMany();
        const categories = categoriesRaw.map((c) => c.categorie);
        return {
            user: {
                id: stagiaire.id,
                prenom: stagiaire.prenom,
                image: stagiaire.user?.image || null,
            },
            quiz_stats: {
                total_quizzes: parseInt(quizStats?.total_quizzes || "0") || 0,
                total_points: parseInt(quizStats?.total_points || "0") || 0,
                average_score: parseFloat(quizStats?.avg_score || "0") || 0,
            },
            recent_history: recentHistory,
            contacts: {
                formateurs,
                commerciaux,
                pole_relation: poleRelation,
            },
            catalogue_formations: catalogueFormations,
            categories,
        };
    }
    async getContacts(userId) {
        const data = await this.getHomeData(userId);
        return data.contacts;
    }
    async getContactsByType(userId, type) {
        const data = await this.getHomeData(userId);
        switch (type) {
            case "commercial":
                return data.contacts.commerciaux;
            case "formateur":
                return data.contacts.formateurs;
            case "pole-relation":
            case "pole-save":
                return data.contacts.pole_relation;
            default:
                return [];
        }
    }
    async getStagiaireQuizzes(userId) {
        try {
            const stagiaire = await this.stagiaireRepository.findOne({
                where: { user_id: userId },
                relations: [
                    "stagiaire_catalogue_formations",
                    "stagiaire_catalogue_formations.catalogue_formation",
                    "stagiaire_catalogue_formations.catalogue_formation.formation",
                ],
            });
            if (!stagiaire)
                return { data: [] };
            const formationIds = (stagiaire.stagiaire_catalogue_formations || [])
                .map((scf) => scf.catalogue_formation?.formation_id)
                .filter((id) => id !== null && id !== undefined);
            if (formationIds.length === 0)
                return { data: [] };
            const quizzes = await this.quizRepository.find({
                where: {
                    formation_id: (0, typeorm_3.In)(formationIds),
                },
                relations: ["formation"],
            });
            const participations = await this.participationRepository.find({
                where: { user_id: userId },
            });
            const mappedQuizzes = quizzes.map((quiz) => {
                const participation = participations.find((p) => p.quiz_id === quiz.id);
                return {
                    id: quiz.id.toString(),
                    titre: quiz.titre,
                    description: quiz.description,
                    duree: quiz.duree || null,
                    niveau: quiz.niveau || "débutant",
                    status: quiz.status || "actif",
                    nb_points_total: Number(quiz.nb_points_total) || 0,
                    formationId: quiz.formation_id?.toString(),
                    categorie: quiz.formation?.categorie || null,
                    formation: quiz.formation
                        ? {
                            id: quiz.formation.id,
                            titre: quiz.formation.titre || null,
                            categorie: quiz.formation.categorie || null,
                        }
                        : null,
                    questions: [],
                    userParticipation: participation
                        ? {
                            id: participation.id,
                            status: participation.status,
                            score: participation.score,
                            correct_answers: participation.correct_answers,
                            time_spent: participation.time_spent,
                            started_at: participation.started_at
                                ? participation.started_at.toISOString()
                                : null,
                            completed_at: participation.completed_at
                                ? participation.completed_at.toISOString()
                                : null,
                        }
                        : null,
                };
            });
            return { data: mappedQuizzes };
        }
        catch (error) {
            console.error("Error in getStagiaireQuizzes:", error);
            throw new Error(`Failed to get stagiaire quizzes: ${error.message}`);
        }
    }
    async getFormationsByStagiaire(stagiaireId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: [
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation.medias",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const formationMap = new Map();
        stagiaire.stagiaire_catalogue_formations?.forEach((scf) => {
            const formation = scf.catalogue_formation.formation;
            if (formation) {
                if (!formationMap.has(formation.id)) {
                    formationMap.set(formation.id, {
                        id: formation.id,
                        titre: formation.titre,
                        slug: formation.slug,
                        description: formation.description,
                        statut: formation.statut,
                        duree: formation.duree,
                        categorie: formation.categorie,
                        image: formation.image,
                        icon: formation.icon,
                        created_at: formation.created_at,
                        updated_at: formation.updated_at,
                        medias: formation.medias || [],
                        catalogue_formation: [],
                    });
                }
                formationMap.get(formation.id).catalogue_formation.push({
                    id: scf.catalogue_formation.id,
                    titre: scf.catalogue_formation.titre,
                    description: scf.catalogue_formation.description,
                    prerequis: scf.catalogue_formation.prerequis,
                    image_url: scf.catalogue_formation.image_url,
                    cursus_pdf: scf.catalogue_formation.cursus_pdf,
                    tarif: scf.catalogue_formation.tarif,
                    certification: scf.catalogue_formation.certification,
                    statut: scf.catalogue_formation.statut,
                    duree: scf.catalogue_formation.duree,
                    formation_id: scf.catalogue_formation.formation_id,
                    created_at: scf.catalogue_formation.created_at,
                    updated_at: scf.catalogue_formation.updated_at,
                    objectifs: scf.catalogue_formation.objectifs,
                    programme: scf.catalogue_formation.programme,
                    modalites: scf.catalogue_formation.modalites,
                    modalites_accompagnement: scf.catalogue_formation.modalites_accompagnement,
                    moyens_pedagogiques: scf.catalogue_formation.moyens_pedagogiques,
                    modalites_suivi: scf.catalogue_formation.modalites_suivi,
                    evaluation: scf.catalogue_formation.evaluation,
                    lieu: scf.catalogue_formation.lieu,
                    niveau: scf.catalogue_formation.niveau,
                    public_cible: scf.catalogue_formation.public_cible,
                    nombre_participants: scf.catalogue_formation.nombre_participants,
                });
            }
        });
        return {
            success: true,
            data: Array.from(formationMap.values()),
        };
    }
    async getStagiaireById(id) {
        const stagiaire = await this.stagiaireRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.user", "user")
            .leftJoinAndSelect("s.formateurs", "formateurs")
            .leftJoinAndSelect("formateurs.user", "formateurs_user")
            .leftJoinAndSelect("s.commercials", "commercials")
            .leftJoinAndSelect("commercials.user", "commercials_user")
            .leftJoinAndSelect("s.poleRelationClients", "prc")
            .leftJoinAndSelect("prc.user", "prc_user")
            .leftJoinAndSelect("s.stagiaire_catalogue_formations", "scf")
            .leftJoinAndSelect("scf.catalogue_formation", "cf")
            .leftJoinAndSelect("cf.formation", "f")
            .where("s.id = :id", { id })
            .getOne();
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const stats = await this.classementRepository
            .createQueryBuilder("classement")
            .select("COUNT(DISTINCT classement.quiz_id)", "totalCompleted")
            .addSelect("SUM(classement.points)", "totalPoints")
            .where("classement.stagiaire_id = :id", { id: stagiaire.id })
            .getRawOne();
        const allStats = await this.classementRepository
            .createQueryBuilder("classement")
            .select("stagiaire_id")
            .addSelect("SUM(points)", "total")
            .groupBy("stagiaire_id")
            .orderBy("total", "DESC")
            .getRawMany();
        const rank = allStats.findIndex((s) => parseInt(s.stagiaire_id) === id) + 1;
        const lastRanking = await this.classementRepository.findOne({
            where: { stagiaire_id: stagiaire.id },
            order: { updated_at: "DESC" },
        });
        const levelStats = await this.classementRepository
            .createQueryBuilder("classement")
            .innerJoin("classement.quiz", "quiz")
            .select("quiz.niveau", "level")
            .addSelect("COUNT(DISTINCT classement.quiz_id)", "completed")
            .where("classement.stagiaire_id = :id", { id: stagiaire.id })
            .groupBy("quiz.niveau")
            .getRawMany();
        const totalByLevel = await this.classementRepository.manager
            .getRepository("Quiz")
            .createQueryBuilder("quiz")
            .select("quiz.niveau", "level")
            .addSelect("COUNT(*)", "total")
            .where("quiz.status = :status", { status: "actif" })
            .groupBy("quiz.niveau")
            .getRawMany();
        const getStatForLevel = (levelName) => {
            const completed = levelStats.find((s) => s.level?.toLowerCase() === levelName.toLowerCase())?.completed || 0;
            const total = totalByLevel.find((t) => t.level?.toLowerCase() === levelName.toLowerCase())?.total || 0;
            return { completed: parseInt(completed), total: parseInt(total) };
        };
        const [fName, ...lParts] = (stagiaire.user?.name || "").split(" ");
        const lEx = lParts.join(" ") || "";
        return {
            id: stagiaire.id,
            firstname: stagiaire.prenom || fName || "Anonyme",
            lastname: lEx,
            name: lEx,
            avatar: stagiaire.user?.image || null,
            rang: rank || 0,
            totalPoints: parseInt(stats?.totalPoints || "0"),
            formations: (stagiaire.stagiaire_catalogue_formations || []).map((scf) => ({
                id: scf.catalogue_formation?.id,
                titre: scf.catalogue_formation?.formation?.titre || "N/A",
            })),
            formateurs: (stagiaire.formateurs || []).map((f) => ({
                id: f.id,
                prenom: f.prenom || "",
                nom: f.nom || f.user?.name?.split(" ").slice(1).join(" ") || "",
                image: f.user?.image || null,
            })),
            quizStats: {
                totalCompleted: parseInt(stats?.totalCompleted || "0"),
                totalQuiz: parseInt(totalByLevel.reduce((acc, curr) => acc + parseInt(curr.total), 0)),
                pourcentageReussite: stats?.totalCompleted > 0
                    ? Math.round((parseInt(stats.totalCompleted) /
                        totalByLevel.reduce((acc, curr) => acc + parseInt(curr.total), 0)) *
                        100)
                    : 0,
                byLevel: {
                    debutant: getStatForLevel("Débutant"),
                    intermediaire: getStatForLevel("Intermédiaire"),
                    expert: getStatForLevel("Expert"),
                },
                lastActivity: lastRanking?.updated_at || null,
            },
        };
    }
    async getMyPartner(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["partenaire", "partenaires"],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire with user_id ${userId} not found`);
        }
        let partenaire = stagiaire.partenaire;
        if (!partenaire &&
            stagiaire.partenaires &&
            stagiaire.partenaires.length > 0) {
            partenaire = stagiaire.partenaires[0];
        }
        if (!partenaire) {
            throw new common_1.NotFoundException("Aucun partenaire associé");
        }
        return {
            identifiant: partenaire.identifiant,
            type: partenaire.type,
            adresse: partenaire.adresse,
            ville: partenaire.ville,
            departement: partenaire.departement,
            code_postal: partenaire.code_postal,
            logo: partenaire.logo,
            actif: Boolean(partenaire.actif ?? true),
            contacts: partenaire.contacts ?? [],
        };
    }
    async getDetailedProfile(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["user"],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire not found`);
        }
        return {
            id: stagiaire.id,
            prenom: stagiaire.prenom,
            nom: stagiaire.user?.name || "",
            telephone: stagiaire.telephone,
            ville: stagiaire.ville,
            code_postal: stagiaire.code_postal,
            adresse: stagiaire.adresse,
            email: stagiaire.user?.email,
            image: stagiaire.user?.image,
        };
    }
    async updatePassword(userId, data) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const isMatch = await bcrypt.compare(data.current_password, user.password);
        if (!isMatch) {
            throw new Error("Current password does not match");
        }
        user.password = await bcrypt.hash(data.new_password, 10);
        await this.userRepository.save(user);
        return true;
    }
    async updateProfilePhoto(userId, photoPath) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        user.image = photoPath;
        await this.userRepository.save(user);
        return true;
    }
    async setOnboardingSeen(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire)
            throw new common_1.NotFoundException("Stagiaire not found");
        stagiaire.onboarding_seen = true;
        await this.stagiaireRepository.save(stagiaire);
        return true;
    }
    async getOnlineUsers() {
        const onlineUsers = await this.userRepository.find({
            where: { is_online: true },
            order: { last_activity_at: "DESC" },
        });
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentlyOnline = await this.userRepository
            .createQueryBuilder("user")
            .where("user.is_online = :isOnline", { isOnline: false })
            .andWhere("user.last_activity_at >= :cutoff", {
            cutoff: fifteenMinutesAgo,
        })
            .orderBy("user.last_activity_at", "DESC")
            .getMany();
        const allUsers = await this.userRepository.find({
            order: { last_activity_at: "DESC" },
        });
        return {
            online_users: onlineUsers,
            recently_online: recentlyOnline,
            all_users: allUsers,
        };
    }
    async getShowData(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const [profile, stats, formations, agenda, notifications, media] = await Promise.all([
            this.getDetailedProfile(userId),
            this.rankingService.getStagiaireProgress(userId),
            this.getFormationsByStagiaire(stagiaire.id),
            this.agendaService.getStagiaireAgenda(userId),
            this.agendaService.getStagiaireNotifications(userId),
            this.mediaService.getTutorials(userId),
        ]);
        const formationsData = formations.data || formations;
        return {
            stagiaire: profile,
            stats: stats,
            formations: formationsData,
            agenda: agenda,
            notifications: notifications,
            media: media,
        };
    }
};
exports.StagiaireService = StagiaireService;
exports.StagiaireService = StagiaireService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(1, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(3, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(5, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ranking_service_1.RankingService,
        agenda_service_1.AgendaService,
        media_service_1.MediaService])
], StagiaireService);
//# sourceMappingURL=stagiaire.service.js.map