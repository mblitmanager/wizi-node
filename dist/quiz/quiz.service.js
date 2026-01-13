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
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const quiz_participation_answer_entity_1 = require("../entities/quiz-participation-answer.entity");
const correspondance_pair_entity_1 = require("../entities/correspondance-pair.entity");
const progression_entity_1 = require("../entities/progression.entity");
let QuizService = class QuizService {
    constructor(quizRepository, questionRepository, formationRepository, classementRepository, participationRepository, participationAnswerRepository, correspondancePairRepository, progressionRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.formationRepository = formationRepository;
        this.classementRepository = classementRepository;
        this.participationRepository = participationRepository;
        this.participationAnswerRepository = participationAnswerRepository;
        this.correspondancePairRepository = correspondancePairRepository;
        this.progressionRepository = progressionRepository;
    }
    async getAllQuizzes() {
        return this.quizRepository.find({ relations: ["formation"] });
    }
    async getQuestionsByQuiz(quizId) {
        try {
            const quiz = await this.quizRepository.findOne({
                where: { id: quizId },
                relations: ["questions", "questions.reponses", "formation"],
            });
            if (!quiz) {
                throw new Error("Quiz not found");
            }
            const rawQuestions = quiz.questions.map((question) => ({
                id: question.id,
                quiz_id: quizId,
                text: question.text,
                type: question.type,
                explication: question.explication,
                points: question.points,
                astuce: question.astuce,
                media_url: question.media_url,
                created_at: question.created_at,
                updated_at: question.updated_at,
                reponses: (question.reponses || []).map((reponse) => ({
                    id: reponse.id,
                    text: reponse.text,
                    question_id: question.id,
                    is_correct: reponse.isCorrect ? 1 : 0,
                    position: reponse.position,
                    match_pair: reponse.match_pair,
                    bank_group: reponse.bank_group,
                    flashcard_back: reponse.flashcardBack,
                    created_at: reponse.created_at,
                    updated_at: reponse.updated_at,
                })),
            }));
            return { data: rawQuestions };
        }
        catch (error) {
            console.error("Error in getQuestionsByQuiz:", error);
            throw new Error(`Failed to get quiz questions: ${error.message}`);
        }
    }
    async getQuizDetails(id) {
        try {
            const quiz = await this.quizRepository.findOne({
                where: { id },
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
                    explication: question.explication,
                    points: question.points?.toString() || "1",
                    astuce: question.astuce,
                    quizId: id,
                    mediaUrl: question.media_url || null,
                };
                questionData.answers = (question.reponses || [])
                    .map((reponse) => ({
                    id: reponse.id.toString(),
                    text: reponse.text || "",
                    isCorrect: reponse.isCorrect ? 1 : 0,
                    position: reponse.position,
                    matchPair: reponse.match_pair,
                    bankGroup: reponse.bank_group,
                    flashcardBack: reponse.flashcardBack,
                }))
                    .sort((a, b) => a.id.localeCompare(b.id));
                return questionData;
            });
            return {
                id: quiz.id,
                titre: quiz.titre,
                description: quiz.description,
                duree: quiz.duree?.toString() || "30",
                niveau: quiz.niveau || "débutant",
                status: quiz.status || "actif",
                nb_points_total: quiz.nb_points_total?.toString() || "0",
                formation: quiz.formation
                    ? {
                        id: quiz.formation.id,
                        titre: quiz.formation.titre,
                        description: quiz.formation.description,
                        duree: quiz.formation.duree?.toString() || "30",
                        categorie: quiz.formation.categorie || "Général",
                    }
                    : null,
                questions,
            };
        }
        catch (error) {
            console.error("Error in getQuizDetails:", error);
            throw new Error(`Failed to get quiz details: ${error.message}`);
        }
    }
    async getQuizJsonLd(id) {
        try {
            const quiz = await this.quizRepository.findOne({
                where: { id },
                relations: ["questions", "formation"],
            });
            if (!quiz) {
                throw new Error("Quiz not found");
            }
            return this.formatQuizJsonLd(quiz);
        }
        catch (error) {
            console.error("Error in getQuizJsonLd:", error);
            throw new Error(`Failed to get quiz JSON-LD: ${error.message}`);
        }
    }
    formatQuizJsonLd(quiz) {
        return {
            "@context": "/api/contexts/Quiz",
            "@id": `/api/quizzes/${quiz.id}`,
            "@type": "Quiz",
            id: quiz.id,
            titre: quiz.titre || "",
            description: quiz.description || "",
            duree: quiz.duree?.toString() || "30",
            formation: quiz.formation ? `/api/formations/${quiz.formation.id}` : null,
            nbPointsTotal: quiz.nb_points_total?.toString() || "0",
            niveau: quiz.niveau || "débutant",
            questions: (quiz.questions || []).map((q) => `/api/questions/${q.id}`),
            participations: [],
            status: quiz.status || "actif",
            created_at: quiz.created_at?.toISOString() || new Date().toISOString(),
            updated_at: quiz.updated_at?.toISOString() || new Date().toISOString(),
        };
    }
    formatQuestionJsonLd(question) {
        return {
            "@id": `/api/questions/${question.id}`,
            "@type": "Question",
            id: question.id,
            texte: question.text,
            type: question.type || "choix multiples",
            points: question.points?.toString() || "1",
            astuce: question.astuce,
            explication: question.explication,
            audio_url: question.audio_url,
            media_url: question.media_url,
            flashcard_back: question.flashcard_back,
            quiz: question.quiz_id
                ? `/api/quizzes/${question.quiz_id}`
                : question.quiz
                    ? `/api/quizzes/${question.quiz.id}`
                    : null,
            reponses: (question.reponses || []).map((r) => `/api/reponses/${r.id}`),
            created_at: question.created_at,
            updated_at: question.updated_at,
        };
    }
    formatReponseJsonLd(reponse) {
        return {
            "@id": `/api/reponses/${reponse.id}`,
            "@type": "Reponse",
            id: reponse.id,
            texte: reponse.text,
            correct: reponse.isCorrect || false,
            position: reponse.position,
            explanation: reponse.flashcardBack,
            match_pair: reponse.match_pair,
            bank_group: reponse.bank_group,
            question: reponse.question_id
                ? `/api/questions/${reponse.question_id}`
                : reponse.question
                    ? `/api/questions/${reponse.question.id}`
                    : null,
            created_at: reponse.created_at,
            updated_at: reponse.updated_at,
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
    async isAnswerCorrect(question, selectedAnswers) {
        const normalize = (value) => {
            if (Array.isArray(value)) {
                return value.filter((v) => v !== null && v !== "" && v !== undefined);
            }
            return value !== null && value !== "" && value !== undefined
                ? value
                : null;
        };
        const cleanedSelectedAnswers = normalize(selectedAnswers);
        const correctAnswers = question.reponses
            .filter((r) => r.isCorrect)
            .map((r) => r.text);
        switch (question.type) {
            case "correspondance":
                const reponsesMap = new Map(question.reponses.map((r) => [r.id.toString(), r.text]));
                const selectedPairs = {};
                if (typeof selectedAnswers === "object" && selectedAnswers !== null) {
                    for (const [leftId, rightText] of Object.entries(selectedAnswers)) {
                        const leftText = reponsesMap.get(leftId.toString());
                        if (leftText && rightText) {
                            selectedPairs[leftText] = rightText;
                        }
                    }
                }
                const dbCorrectPairs = await this.correspondancePairRepository.find({
                    where: { question_id: question.id },
                });
                const correctPairs = {};
                if (dbCorrectPairs.length > 0) {
                    dbCorrectPairs.forEach((pair) => {
                        correctPairs[pair.left_text] = pair.right_text;
                    });
                }
                else {
                    question.reponses.forEach((r) => {
                        if (r.match_pair) {
                            correctPairs[r.text] = r.match_pair;
                        }
                    });
                }
                let isMatchCorrect = true;
                const correctKeys = Object.keys(correctPairs);
                const selectedKeys = Object.keys(selectedPairs);
                if (correctKeys.length !== selectedKeys.length) {
                    isMatchCorrect = false;
                }
                else {
                    for (const key of correctKeys) {
                        if (correctPairs[key] !== selectedPairs[key]) {
                            isMatchCorrect = false;
                            break;
                        }
                    }
                }
                return {
                    selectedAnswers: selectedPairs,
                    correctAnswers: correctPairs,
                    isCorrect: isMatchCorrect,
                    match_pair: Object.keys(correctPairs).map((key) => ({
                        left: key,
                        right: correctPairs[key],
                    })),
                };
            case "carte flash":
            case "question audio":
                const selectedText = Array.isArray(cleanedSelectedAnswers)
                    ? cleanedSelectedAnswers[0]
                    : typeof cleanedSelectedAnswers === "object" &&
                        cleanedSelectedAnswers?.text
                        ? cleanedSelectedAnswers.text
                        : cleanedSelectedAnswers;
                return {
                    selectedAnswers: selectedText,
                    correctAnswers: correctAnswers,
                    isCorrect: selectedText && correctAnswers.includes(selectedText),
                };
            case "remplir le champ vide":
                const correctBlanks = {};
                question.reponses.forEach((r) => {
                    if (r.bank_group && r.isCorrect) {
                        correctBlanks[r.bank_group] = normalize(r.text);
                    }
                });
                let isBlankCorrect = false;
                if (typeof cleanedSelectedAnswers === "object" &&
                    !Array.isArray(cleanedSelectedAnswers)) {
                    isBlankCorrect = true;
                    for (const group of Object.keys(correctBlanks)) {
                        const userText = normalize(cleanedSelectedAnswers[group]);
                        if (userText !== correctBlanks[group]) {
                            isBlankCorrect = false;
                            break;
                        }
                    }
                    if (Object.keys(cleanedSelectedAnswers).length !==
                        Object.keys(correctBlanks).length) {
                        isBlankCorrect = false;
                    }
                }
                else if (Array.isArray(cleanedSelectedAnswers)) {
                    const userTexts = cleanedSelectedAnswers.map((v) => normalize(v));
                    const correctTexts = Object.values(correctBlanks).map((v) => normalize(v));
                    isBlankCorrect =
                        JSON.stringify(userTexts.sort()) ===
                            JSON.stringify(correctTexts.sort());
                }
                return {
                    selectedAnswers: cleanedSelectedAnswers,
                    correctAnswers: correctBlanks,
                    isCorrect: isBlankCorrect,
                };
            case "rearrangement":
                const correctOrder = question.reponses
                    .filter((r) => r.isCorrect || true)
                    .filter((r) => r.isCorrect)
                    .sort((a, b) => (a.position || 0) - (b.position || 0))
                    .map((r) => r.text);
                const userOrder = Array.isArray(cleanedSelectedAnswers)
                    ? cleanedSelectedAnswers
                    : [];
                const isOrderCorrect = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
                return {
                    selectedAnswers: userOrder,
                    correctAnswers: correctOrder,
                    isCorrect: isOrderCorrect,
                };
            default:
                const selected = Array.isArray(cleanedSelectedAnswers)
                    ? cleanedSelectedAnswers
                    : [cleanedSelectedAnswers];
                const diff1 = selected.filter((x) => !correctAnswers.includes(x));
                const diff2 = correctAnswers.filter((x) => !selected.includes(x));
                return {
                    selectedAnswers: selected,
                    correctAnswers: correctAnswers,
                    isCorrect: diff1.length === 0 && diff2.length === 0,
                };
        }
    }
    async submitQuizResult(quizId, userId, stagiaireId, answers, timeSpent) {
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ["questions", "questions.reponses", "formation"],
        });
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        const participation = this.participationRepository.create({
            user_id: userId,
            quiz_id: quizId,
            status: "completed",
            started_at: new Date(),
            completed_at: new Date(),
            score: 0,
            correct_answers: 0,
            time_spent: timeSpent,
        });
        const savedParticipation = await this.participationRepository.save(participation);
        let correctCount = 0;
        const questionsDetails = [];
        for (const question of quiz.questions) {
            const userAnswer = answers[question.id];
            if (userAnswer === undefined || userAnswer === null)
                continue;
            const result = await this.isAnswerCorrect(question, userAnswer);
            if (result.isCorrect)
                correctCount++;
            await this.participationAnswerRepository.save({
                participation_id: savedParticipation.id,
                question_id: question.id,
                answer_ids: userAnswer,
            });
            questionsDetails.push({
                id: question.id,
                text: question.text,
                type: question.type,
                selectedAnswers: result.selectedAnswers,
                correctAnswers: result.correctAnswers,
                isCorrect: result.isCorrect,
                answers: question.reponses.map((r) => ({
                    id: r.id,
                    text: r.text,
                    isCorrect: r.isCorrect,
                })),
                meta: question.type === "correspondance"
                    ? {
                        selectedAnswers: result.selectedAnswers,
                        correctAnswers: result.correctAnswers,
                        isCorrect: result.isCorrect,
                        match_pair: result.match_pair,
                    }
                    : null,
            });
        }
        const score = correctCount * 2;
        const totalQuestions = questionsDetails.length;
        savedParticipation.score = score;
        savedParticipation.correct_answers = correctCount;
        await this.participationRepository.save(savedParticipation);
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
            classement.updated_at = new Date();
            await this.classementRepository.save(classement);
        }
        const progression = this.progressionRepository.create({
            stagiaire_id: stagiaireId,
            quiz_id: quizId,
            formation_id: quiz.formation?.id,
            score: score,
            correct_answers: correctCount,
            total_questions: totalQuestions,
            time_spent: timeSpent,
            completion_time: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            termine: true,
            pourcentage: totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
        });
        await this.progressionRepository.save(progression);
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
    __param(4, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(5, (0, typeorm_1.InjectRepository)(quiz_participation_answer_entity_1.QuizParticipationAnswer)),
    __param(6, (0, typeorm_1.InjectRepository)(correspondance_pair_entity_1.CorrespondancePair)),
    __param(7, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map