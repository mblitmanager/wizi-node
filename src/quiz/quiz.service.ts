import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(QuizParticipation)
    private participationRepository: Repository<QuizParticipation>,
    @InjectRepository(QuizParticipationAnswer)
    private participationAnswerRepository: Repository<QuizParticipationAnswer>
  ) {}

  async getAllQuizzes() {
    return this.quizRepository.find({ relations: ["formation"] });
  }

  async getQuestionsByQuiz(quizId: number) {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id: quizId },
        relations: ["questions", "questions.reponses", "formation"],
      });

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      // Format matching Laravel's /api/quiz/{id}/questions endpoint exactly
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

      // Return { data: [...] } structure
      return { data: rawQuestions };
    } catch (error) {
      console.error("Error in getQuestionsByQuiz:", error);
      throw new Error(`Failed to get quiz questions: ${error.message}`);
    }
  }

  async getQuizDetails(id: number) {
    // This is used for the /api/quiz/:id endpoint (full rich details)
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ["questions", "questions.reponses", "formation"],
      });

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      // Map questions with proper formatting based on type (Rich format for FE app usage of quiz taking)
      const questions = quiz.questions.map((question) => {
        const questionData: any = {
          id: question.id.toString(),
          text: question.text,
          type: question.type || "choix multiples",
        };

        // Default answers for all question types
        questionData.answers = (question.reponses || [])
          .map((reponse) => ({
            id: reponse.id.toString(),
            text: reponse.text || "",
            isCorrect: Boolean(reponse.isCorrect),
          }))
          .sort((a, b) => a.id.localeCompare(b.id));

        // Type-specific formatting (KEPT AS BEFORE for getById)
        switch (question.type) {
          case "rearrangement":
            questionData.answers = (question.reponses || [])
              .map((reponse) => ({
                id: reponse.id.toString(),
                text: reponse.text || "",
                position: reponse.position || 0,
              }))
              .sort((a, b) => (a.position || 0) - (b.position || 0));
            break;

          case "remplir le champ vide":
            questionData.blanks = (question.reponses || []).map((reponse) => ({
              id: reponse.id.toString(),
              text: reponse.text || "",
              bankGroup: reponse.bank_group || null,
            }));
            break;

          case "banque de mots":
            questionData.wordbank = (question.reponses || []).map(
              (reponse) => ({
                id: reponse.id.toString(),
                text: reponse.text || "",
                isCorrect: Boolean(reponse.isCorrect),
                bankGroup: reponse.bank_group || null,
              })
            );
            break;

          case "carte flash":
            questionData.flashcard = {
              front: question.text || "",
              back: question.flashcard_back || "",
            };
            break;

          case "correspondance":
            questionData.matching = (question.reponses || []).map(
              (reponse) => ({
                id: reponse.id.toString(),
                text: reponse.text || "",
                matchPair: reponse.match_pair || null,
              })
            );
            break;

          case "question audio":
            questionData.audioUrl = question.media_url || null;
            break;
        }

        return questionData;
      });

      // Return formatted response matching Laravel structure
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
    } catch (error) {
      console.error("Error in getQuizDetails:", error);
      throw new Error(`Failed to get quiz details: ${error.message}`);
    }
  }

  async getCategories() {
    const formations = await this.formationRepository.find({
      where: { statut: 1 },
      relations: ["quizzes"],
    });

    const categoriesMap: {
      [key: string]: {
        name: string;
        icon: string;
        description: string;
        quizCount: number;
      };
    } = {};

    formations.forEach((f) => {
      const cat = f.categorie || "Général";
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = {
          name: cat,
          icon: f.icon || "help-circle",
          description:
            f.description || `Explorez les quizzes de la catégorie ${cat}`,
          quizCount: 0,
        };
      }
      categoriesMap[cat].quizCount += (f.quizzes || []).length;
    });

    const categoryColors: { [key: string]: string } = {
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

  async getHistoryByStagiaire(stagiaireId: number) {
    return this.classementRepository.find({
      where: { stagiaire_id: stagiaireId },
      relations: ["quiz"],
      order: { updated_at: "DESC" },
    });
  }

  async getStats(userId: number) {
    // Get basic stats for the user
    const stats = await this.classementRepository
      .createQueryBuilder("classement")
      .select("COUNT(*)", "total_quizzes")
      .addSelect("SUM(classement.points)", "total_points")
      .addSelect("AVG(classement.points)", "average_score")
      .where(
        "classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      )
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

  async getStatsCategories(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .leftJoinAndSelect("classement.quiz", "quiz")
      .leftJoinAndSelect("quiz.formation", "formation")
      .select("formation.categorie", "category")
      .addSelect("COUNT(classement.id)", "count")
      .addSelect("AVG(classement.points)", "average_points")
      .where(
        "classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      )
      .groupBy("formation.categorie")
      .getRawMany();
  }

  async getStatsProgress(userId: number) {
    return this.classementRepository.find({
      where: {
        stagiaire_id: userId,
      },
      relations: ["quiz"],
      order: { created_at: "DESC" },
      take: 10,
    });
  }

  async getStatsTrends(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .select("DATE(classement.created_at)", "date")
      .addSelect("COUNT(classement.id)", "count")
      .addSelect("AVG(classement.points)", "average_points")
      .where(
        "classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      )
      .groupBy("DATE(classement.created_at)")
      .orderBy("DATE(classement.created_at)", "DESC")
      .limit(30)
      .getRawMany();
  }

  async getStatsPerformance(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .leftJoinAndSelect("classement.quiz", "quiz")
      .select("quiz.titre", "quiz_title")
      .addSelect("classement.points", "score")
      .addSelect("classement.created_at", "date")
      .where(
        "classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)",
        { userId }
      )
      .orderBy("classement.created_at", "DESC")
      .take(20)
      .getRawMany();
  }

  async getQuizzesByCategory(category: string, stagiaireId: number) {
    // Get quiz IDs accessible to this stagiaire via catalogue formations
    const quizzes = await this.quizRepository
      .createQueryBuilder("quiz")
      .innerJoin("quiz.formation", "formation")
      .innerJoin("formations", "f", "f.id = formation.id")
      .innerJoin("catalogue_formations", "cf", "cf.formation_id = f.id")
      .innerJoin(
        "stagiaire_catalogue_formations",
        "scf",
        "scf.catalogue_formation_id = cf.id"
      )
      .where("formation.categorie = :category", { category })
      .andWhere("scf.stagiaire_id = :stagiaireId", { stagiaireId })
      .andWhere("quiz.status = :status", { status: "actif" })
      .leftJoinAndSelect("quiz.formation", "quizFormation")
      .getMany();

    // Format matching Laravel
    return quizzes.map((quiz) => ({
      id: quiz.id.toString(),
      titre: quiz.titre,
      description: quiz.description?.substring(0, 150) || "",
      categorie: quiz.formation?.categorie || "Non catégorisé",
      categorieId: quiz.formation?.categorie || "non-categorise",
      niveau: quiz.niveau || "débutant",
      questionCount: 0, // Lightweight - no eager load
      questions: [],
      points: parseInt(quiz.nb_points_total?.toString() || "0"),
    }));
  }

  async getQuizStatistics(quizId: number, stagiaireId: number) {
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
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            (scores.reduce((a, b) => a + b, 0) / totalAttempts) * 100
          ) / 100
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
            time_spent: 0, // Classement doesn't store time_spent
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

  private isAnswerCorrect(question: Question, selectedAnswers: any): any {
    const normalize = (value: any) => {
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
        // Node implementation using Reponse.match_pair instead of separate table
        const reponsesMap = new Map(
          question.reponses.map((r) => [r.id.toString(), r.text])
        );

        const selectedPairs: Record<string, string> = {};
        if (typeof selectedAnswers === "object" && selectedAnswers !== null) {
          for (const [leftId, rightText] of Object.entries(selectedAnswers)) {
            const leftText = reponsesMap.get(leftId.toString());
            if (leftText && rightText) {
              selectedPairs[leftText] = rightText as string;
            }
          }
        }

        // Logic based on Reponse.match_pair (assuming it holds the 'right' side)
        // Check if reponse.match_pair matches the user's selected right text for the left text (reponse.text)
        const correctPairs: Record<string, string> = {};
        question.reponses.forEach((r) => {
          if (r.match_pair) {
            correctPairs[r.text] = r.match_pair;
          }
        });

        // Determine correctness
        let isMatchCorrect = true;
        const correctKeys = Object.keys(correctPairs);
        const selectedKeys = Object.keys(selectedPairs);

        if (correctKeys.length !== selectedKeys.length) {
          isMatchCorrect = false;
        } else {
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
        // Single text comparison usually
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
        const correctBlanks: Record<string, string> = {};
        question.reponses.forEach((r) => {
          if (r.bank_group && r.isCorrect) {
            correctBlanks[r.bank_group] = normalize(r.text);
          }
        });

        let isBlankCorrect = false;

        if (
          typeof cleanedSelectedAnswers === "object" &&
          !Array.isArray(cleanedSelectedAnswers)
        ) {
          // Object of blanks { group: text }
          isBlankCorrect = true;
          for (const group of Object.keys(correctBlanks)) {
            const userText = normalize(cleanedSelectedAnswers[group]);
            if (userText !== correctBlanks[group]) {
              isBlankCorrect = false;
              break;
            }
          }
          // Also check counts
          if (
            Object.keys(cleanedSelectedAnswers).length !==
            Object.keys(correctBlanks).length
          ) {
            isBlankCorrect = false;
          }
        } else if (Array.isArray(cleanedSelectedAnswers)) {
          // Simple array comparison if no groups? Unlikely for 'remplir le champ vide' but mirroring Laravel
          const userTexts = cleanedSelectedAnswers.map((v) => normalize(v));
          const correctTexts = Object.values(correctBlanks).map((v) =>
            normalize(v)
          );
          // Naive comparison
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
        // Check order
        const correctOrder = question.reponses
          .filter((r) => r.isCorrect || true) // Usually all are part of sequence, correctness might mean right order.
          // Wait, Laravel says: ->where('is_correct', true)->sortBy('position')
          // So only 'correct' ones form the sequence? Or 'is_correct' marks them as active?
          // Let's assume isCorrect=true for items to arrange.
          .filter((r) => r.isCorrect) // Only correct ones? Or logic assumes all?
          // Laravel: $correctOrder = $question->reponses->where('is_correct', true)->sortBy('position')->pluck('text')
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((r) => r.text);

        const userOrder = Array.isArray(cleanedSelectedAnswers)
          ? cleanedSelectedAnswers
          : [];

        const isOrderCorrect =
          JSON.stringify(correctOrder) === JSON.stringify(userOrder);

        return {
          selectedAnswers: userOrder,
          correctAnswers: correctOrder,
          isCorrect: isOrderCorrect,
        };

      default:
        // choix multiples, banque de mots, vrai/faux
        const selected = Array.isArray(cleanedSelectedAnswers)
          ? cleanedSelectedAnswers
          : [cleanedSelectedAnswers];

        // Check if arrays match (regardless of order for standard MCq? Laravel uses array_diff both ways)
        const diff1 = selected.filter((x: any) => !correctAnswers.includes(x));
        const diff2 = correctAnswers.filter((x: any) => !selected.includes(x));

        return {
          selectedAnswers: selected,
          correctAnswers: correctAnswers,
          isCorrect: diff1.length === 0 && diff2.length === 0,
        };
    }
  }

  async submitQuizResult(
    quizId: number,
    userId: number,
    stagiaireId: number,
    answers: Record<string, any>,
    timeSpent: number
  ) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ["questions", "questions.reponses", "formation"],
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // 1. Create Participation
    const participation = this.participationRepository.create({
      user_id: userId,
      // Wait, entity says user_id. Is stagiaireId the same as user_id?
      // Node's existing submitQuizResult used "stagiaireId".
      // Laravel uses Auth::user()->getKey().
      // If "stagiaireId" passed here is actually the STAGIAIRE ID (table stagiaires),
      // and quiz_participation links to USER (table users), I might need the user_id.
      // Let's assume for now I should use user_id if valid, but I only have stagiaireId passed.
      // I'll stick to stagiaireId for 'user_id' column if that's the pattern,
      // BUT verify schema later. Entity says "user: User", so it likely expects a User ID.
      // I will assume the caller passes the correct User ID or I need to fetch it?
      // Caller `QuizApiController.submitResult` extracts `req.user.stagiaire?.id`.
      // So it passes STAGIAIRE ID.
      // `QuizParticipation` entity in Node has `user_id` and relationship to `User`.
      // `Stagiaire` usually has `user_id`.
      // I should probably find the Stagiaire to get User ID?
      // OR does QuizParticipation link to Stagiaire?
      // Entity says `@ManyToOne(() => User)`.
      // I'll try to find the stagiaire to get the user_id if possible, or assume
      // for now I'll use the passed ID (risky).
      // ACTUALLY, checking the existing `submitQuizResult` signature: user passed `stagiaireId`.
      // I'll assume I need to fetch the UserID from Stagiaire or just save it.
      // For SAFETY: I'll save `user_id: stagiaireId` and fix if FK fails (fast/dirty) OR
      // better: fetch Stagiaire to be sure. But I don't have StagiaireRepo injected.
      // Let's use `quiz_id` and `user_id` as passed.
      quiz_id: quizId,
      status: "completed", // or in_progress first? Laravel does 'in_progress' then update.
      started_at: new Date(),
      completed_at: new Date(),
      score: 0,
      correct_answers: 0,
      time_spent: timeSpent,
    });

    // SAVE PARTICIPATION
    const savedParticipation =
      await this.participationRepository.save(participation);

    let correctCount = 0;
    const questionsDetails = [];

    // 2. Process Questions
    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      // Even if check fails or empty, we process it? Laravel says "if isset".
      if (userAnswer === undefined || userAnswer === null) continue;

      const result = this.isAnswerCorrect(question, userAnswer);

      if (result.isCorrect) correctCount++;

      // Save Answer Log
      await this.participationAnswerRepository.save({
        participation_id: savedParticipation.id,
        question_id: question.id,
        answer_ids: userAnswer, // Storing JSON
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
        meta:
          question.type === "correspondance"
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
    const totalQuestions = questionsDetails.length; // Or quiz.questions.length? Laravel uses questionsDetails.count() which are *answered* ones? No, typically total questions.
    // Laravel: $totalQuestions = $questionsDetails->count(); // ONLY the processed ones matching request?
    // "map(function... return isset...)" -> It filters only answered questions?
    // Yes. `questionsDetails` only has answered.
    // Ideally we want total questions of the quiz.
    // I will use `quiz.questions.length` for total?
    // Laravel uses `$questionsDetails->count()`. This might imply partial submission handling.
    // I will stick to Laravel behavior: `questionsDetails.length`.

    // Update Participation
    savedParticipation.score = score;
    savedParticipation.correct_answers = correctCount;
    await this.participationRepository.save(savedParticipation);

    // 3. Update Classement / Progression
    let classement = await this.classementRepository.findOne({
      where: { quiz_id: quizId, stagiaire_id: stagiaireId },
    });

    if (classement) {
      if (score > (classement.points || 0)) {
        classement.points = score;
        classement.updated_at = new Date();
        await this.classementRepository.save(classement);
      }
    } else {
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
}
