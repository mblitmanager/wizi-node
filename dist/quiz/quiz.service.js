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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
const formation_entity_1 = require("../entities/formation.entity");
const classement_entity_1 = require("../entities/classement.entity");
let QuizService = class QuizService {
    constructor(quizRepository, questionRepository, formationRepository, classementRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.formationRepository = formationRepository;
        this.classementRepository = classementRepository;
    }
    async getAllQuizzes() {
        return this.quizRepository.find({ relations: ["formation"] });
    }
    async getQuizDetails(id) {
        return this.quizRepository.findOne({
            where: { id },
            relations: ["formation"],
        });
    }
    async getQuestionsByQuiz(quizId) {
        return this.questionRepository.find({
            where: { quiz_id: quizId },
            relations: ["reponses"],
        });
    }
    async getCategories() {
        const categoriesRaw = await this.formationRepository
            .createQueryBuilder("formation")
            .select("DISTINCT formation.categorie", "categorie")
            .where("formation.statut = :statut", { statut: "1" })
            .getRawMany();
        return categoriesRaw.map((c) => c.categorie);
    }
    async getHistoryByStagiaire(stagiaireId) {
        return this.classementRepository.find({
            where: { stagiaire_id: stagiaireId },
            relations: ["quiz"],
            order: { updated_at: "DESC" },
        });
    }
    async getStats(userId) {
        const stats = await this.classementRepository
            .createQueryBuilder("classement")
            .select("COUNT(*)", "total_quizzes")
            .addSelect("SUM(classement.points)", "total_points")
            .addSelect("AVG(classement.points)", "average_score")
            .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
            .getRawOne();
        return {
            total_quizzes: parseInt(stats?.total_quizzes || "0") || 0,
            total_points: parseInt(stats?.total_points || "0") || 0,
            average_score: parseFloat(stats?.average_score || "0") || 0,
        };
    }
    async getStatsCategories(userId) {
        return this.classementRepository
            .createQueryBuilder("classement")
            .leftJoinAndSelect("classement.quiz", "quiz")
            .leftJoinAndSelect("quiz.formation", "formation")
            .select("formation.categorie", "category")
            .addSelect("COUNT(classement.id)", "count")
            .addSelect("AVG(classement.points)", "average_points")
            .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
            .groupBy("formation.categorie")
            .getRawMany();
    }
    async getStatsProgress(userId) {
        return this.classementRepository.find({
            where: {
                stagiaire_id: userId,
            },
            relations: ["quiz"],
            order: { created_at: "DESC" },
            take: 10,
        });
    }
    async getStatsTrends(userId) {
        return this.classementRepository
            .createQueryBuilder("classement")
            .select("DATE(classement.created_at)", "date")
            .addSelect("COUNT(classement.id)", "count")
            .addSelect("AVG(classement.points)", "average_points")
            .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
            .groupBy("DATE(classement.created_at)")
            .orderBy("DATE(classement.created_at)", "DESC")
            .limit(30)
            .getRawMany();
    }
    async getStatsPerformance(userId) {
        return this.classementRepository
            .createQueryBuilder("classement")
            .leftJoinAndSelect("classement.quiz", "quiz")
            .select("quiz.titre", "quiz_title")
            .addSelect("classement.points", "score")
            .addSelect("classement.created_at", "date")
            .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
            .orderBy("classement.created_at", "DESC")
            .take(20)
            .getRawMany();
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(3, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map