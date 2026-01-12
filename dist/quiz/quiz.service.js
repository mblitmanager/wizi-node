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
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ["questions", "questions.reponses", "formation"],
        });
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        const questions = quiz.questions.map((question) => {
            const questionData = {
                id: question.id.toString(),
                text: question.text,
                type: question.type || "choix multiples",
            };
            questionData.answers = question.reponses
                .map((reponse) => ({
                id: reponse.id.toString(),
                text: reponse.text,
                isCorrect: reponse.isCorrect === true,
            }))
                .sort((a, b) => a.id.localeCompare(b.id));
            switch (question.type) {
                case "rearrangement":
                    questionData.answers = question.reponses
                        .map((reponse) => ({
                        id: reponse.id.toString(),
                        text: reponse.text,
                        position: reponse.position || 0,
                    }))
                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                    break;
                case "remplir le champ vide":
                    questionData.blanks = question.reponses.map((reponse) => ({
                        id: reponse.id.toString(),
                        text: reponse.text,
                        bankGroup: reponse.bank_group || null,
                    }));
                    break;
                case "banque de mots":
                    questionData.wordbank = question.reponses.map((reponse) => ({
                        id: reponse.id.toString(),
                        text: reponse.text,
                        isCorrect: reponse.isCorrect === true,
                        bankGroup: reponse.bank_group || null,
                    }));
                    break;
                case "carte flash":
                    questionData.flashcard = {
                        front: question.text,
                        back: question.flashcard_back || "",
                    };
                    break;
                case "correspondance":
                    questionData.matching = question.reponses.map((reponse) => ({
                        id: reponse.id.toString(),
                        text: reponse.text,
                        matchPair: reponse.match_pair || null,
                    }));
                    break;
                case "question audio":
                    questionData.audioUrl =
                        question.audio_url || question.media_url || null;
                    break;
            }
            return questionData;
        });
        return {
            id: quiz.id.toString(),
            titre: quiz.titre,
            description: quiz.description,
            categorie: quiz.formation?.categorie || "Non catégorisé",
            categorieId: quiz.formation?.categorie || "non-categorise",
            niveau: quiz.niveau || "débutant",
            questions,
            points: parseInt(quiz.nb_points_total?.toString() || "0"),
        };
    }
    async getCategories() {
        const formations = await this.formationRepository.find({
            where: { statut: 1 },
            relations: ["quizzes"],
        });
        const categoriesMap = {};
        formations.forEach((f) => {
            const cat = f.categorie || "Général";
            if (!categoriesMap[cat]) {
                categoriesMap[cat] = {
                    name: cat,
                    icon: f.icon || "help-circle",
                    description: f.description || `Explorez les quizzes de la catégorie ${cat}`,
                    quizCount: 0,
                };
            }
            categoriesMap[cat].quizCount += (f.quizzes || []).length;
        });
        const categoryColors = {
            Création: "#9392BE",
            Bureautique: "#3D9BE9",
            Développement: "#4CAF50",
            Marketing: "#FF9800",
            Management: "#F44336",
        };
        return Object.keys(categoriesMap).map((catName) => {
            const cat = categoriesMap[catName];
            const color = categoryColors[catName] || "#888888";
            return {
                id: catName,
                name: catName,
                color: color,
                icon: cat.icon,
                description: cat.description,
                quizCount: cat.quizCount,
                colorClass: `category-${catName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`,
            };
        });
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
            totalQuizzes: parseInt(stats?.total_quizzes || "0") || 0,
            totalPoints: parseInt(stats?.total_points || "0") || 0,
            averageScore: parseFloat(stats?.average_score || "0") || 0,
            categoryStats: [],
            levelProgress: {
                débutant: { completed: 0, averageScore: null },
                intermédiaire: { completed: 0, averageScore: null },
                avancé: { completed: 0, averageScore: null },
            },
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
    async getQuizzesByCategory(category, stagiaireId) {
        const quizzes = await this.quizRepository
            .createQueryBuilder("quiz")
            .innerJoin("quiz.formation", "formation")
            .innerJoin("formations", "f", "f.id = formation.id")
            .innerJoin("catalogue_formations", "cf", "cf.formation_id = f.id")
            .innerJoin("stagiaire_catalogue_formations", "scf", "scf.catalogue_formation_id = cf.id")
            .where("formation.categorie = :category", { category })
            .andWhere("scf.stagiaire_id = :stagiaireId", { stagiaireId })
            .andWhere("quiz.status = :status", { status: "actif" })
            .leftJoinAndSelect("quiz.formation", "quizFormation")
            .getMany();
        return quizzes.map((quiz) => ({
            id: quiz.id.toString(),
            titre: quiz.titre,
            description: quiz.description?.substring(0, 150) || "",
            categorie: quiz.formation?.categorie || "Non catégorisé",
            categorieId: quiz.formation?.categorie || "non-categorise",
            niveau: quiz.niveau || "débutant",
            questionCount: 0,
            questions: [],
            points: parseInt(quiz.nb_points_total?.toString() || "0"),
        }));
    }
    async getQuizStatistics(quizId, stagiaireId) {
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ["questions"],
        });
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        const progressions = await this.classementRepository.find({
            where: { quiz_id: quizId, stagiaire_id: stagiaireId },
            order: { created_at: "DESC" },
        });
        const totalAttempts = progressions.length;
        const scores = progressions.map((p) => p.points || 0);
        const averageScore = totalAttempts > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / totalAttempts) * 100) / 100
            : 0;
        const bestScore = totalAttempts > 0 ? Math.max(...scores) : 0;
        const lastAttempt = progressions[0] || null;
        return {
            total_attempts: totalAttempts,
            average_score: averageScore,
            best_score: bestScore,
            last_attempt: lastAttempt
                ? {
                    score: lastAttempt.points,
                    date: lastAttempt.created_at?.toISOString(),
                    time_spent: 0,
                }
                : null,
            quiz: {
                id: quiz.id,
                title: quiz.titre,
                total_questions: quiz.questions?.length || 0,
                total_points: parseInt(quiz.nb_points_total?.toString() || "0"),
            },
        };
    }
    async submitQuizResult(quizId, stagiaireId, answers, timeSpent) {
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ["questions", "questions.reponses", "formation"],
        });
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        let correctCount = 0;
        const questionsDetails = [];
        for (const question of quiz.questions) {
            const userAnswer = answers[question.id];
            if (!userAnswer)
                continue;
            const correctReponses = question.reponses.filter((r) => r.isCorrect);
            let isCorrect = false;
            if (Array.isArray(userAnswer)) {
                const correctIds = correctReponses.map((r) => r.id.toString());
                isCorrect =
                    userAnswer.length === correctIds.length &&
                        userAnswer.every((id) => correctIds.includes(id.toString()));
            }
            else {
                isCorrect = correctReponses.some((r) => r.id.toString() === userAnswer.toString());
            }
            if (isCorrect)
                correctCount++;
            questionsDetails.push({
                id: question.id,
                text: question.text,
                type: question.type,
                isCorrect,
                selectedAnswers: userAnswer,
                correctAnswers: correctReponses.map((r) => r.text),
            });
        }
        const score = correctCount * 2;
        const totalQuestions = quiz.questions.length;
        let classement = await this.classementRepository.findOne({
            where: { quiz_id: quizId, stagiaire_id: stagiaireId },
        });
        if (classement) {
            if (score > (classement.points || 0)) {
                classement.points = score;
                classement.updated_at = new Date();
                await this.classementRepository.save(classement);
            }
        }
        else {
            classement = this.classementRepository.create({
                quiz_id: quizId,
                stagiaire_id: stagiaireId,
                points: score,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await this.classementRepository.save(classement);
        }
        return {
            success: true,
            score,
            correctAnswers: correctCount,
            totalQuestions,
            timeSpent,
            questions: questionsDetails,
            quiz: {
                id: quiz.id,
                titre: quiz.titre,
                formation: quiz.formation
                    ? {
                        id: quiz.formation.id,
                        titre: quiz.formation.titre,
                        categorie: quiz.formation.categorie,
                    }
                    : null,
            },
        };
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