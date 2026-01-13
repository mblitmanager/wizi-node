import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { CorrespondancePair } from "../entities/correspondance-pair.entity";
import { Reponse } from "../entities/reponse.entity";
import { Progression } from "../entities/progression.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";

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
    private participationAnswerRepository: Repository<QuizParticipationAnswer>,
    @InjectRepository(CorrespondancePair)
    private correspondancePairRepository: Repository<CorrespondancePair>,
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(StagiaireCatalogueFormation)
    private scfRepository: Repository<StagiaireCatalogueFormation>
  ) {}

  async getAllQuizzes() {
    return this.quizRepository.find({ relations: ["formation"] });
  }

  async getQuizzesByFormation(stagiaireId?: number) {
    let queryBuilder = this.formationRepository
      .createQueryBuilder("f")
      .leftJoinAndSelect("f.quizzes", "q", "q.status = :status", {
        status: "actif",
      });

    // If stagiaireId provided, filter by stagiaire's catalogue formations (matching Laravel)
    if (stagiaireId) {
      queryBuilder = queryBuilder
        .innerJoin("catalogue_formations", "cf", "cf.formation_id = f.id")
        .innerJoin(
          "stagiaire_catalogue_formations",
          "scf",
          "scf.catalogue_formation_id = cf.id AND scf.stagiaire_id = :stagiaireId",
          { stagiaireId }
        );
    }

    const formations = await queryBuilder.orderBy("f.id", "ASC").getMany();

    // Collect all quiz IDs to fetch questions with reponses in one query
    const quizIds = formations.flatMap((f) =>
      (f.quizzes || []).map((q) => q.id)
    );

    // Fetch questions with reponses separately using find/In for better relation handling
    let allQuestions: Question[] = [];
    if (quizIds.length > 0) {
      allQuestions = await this.questionRepository.find({
        where: { quiz_id: In(quizIds) },
        relations: ["reponses"],
        order: { id: "ASC" },
      });

      // Debug: Check a specific question that was problematic
      const debugQ = allQuestions.find((q) => q.id === 6914);
      if (debugQ) {
        console.log(
          "DEBUG: Question 6914 reponses:",
          JSON.stringify(debugQ.reponses)
        );
      } else if (allQuestions.length > 0) {
        console.log(
          "DEBUG: First question reponses:",
          JSON.stringify(allQuestions[0].reponses)
        );
      }
    }

    // Create a map of quiz_id -> questions
    const questionsByQuizId = new Map<number, Question[]>();
    allQuestions.forEach((q) => {
      const existing = questionsByQuizId.get(q.quiz_id) || [];
      existing.push(q);
      questionsByQuizId.set(q.quiz_id, existing);
    });

    return formations.map((f) => ({
      id: f.id.toString(),
      titre: f.titre,
      description: f.description,
      categorie: f.categorie,
      quizzes: (f.quizzes || []).map((q) => {
        const questions = questionsByQuizId.get(q.id) || [];
        return {
          id: q.id.toString(),
          titre: q.titre,
          description: q.description,
          categorie: f.categorie,
          categorieId: f.categorie,
          niveau: q.niveau || "débutant",
          questions: questions.map((question) => ({
            id: question.id.toString(),
            text: question.text,
            type: question.type || "choix multiples",
            answers: (question.reponses || []).map((r) => ({
              id: r.id.toString(),
              text: r.text,
              isCorrect: Boolean(r.isCorrect),
            })),
          })),
          points: parseInt(q.nb_points_total) || 0,
        };
      }),
    }));
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
    // This is used for the /api/quiz/:id endpoint (full rich details for internal app use)
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ["questions", "questions.reponses", "formation"],
      });

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      // Map questions with proper formatting based on type
      const questions = quiz.questions.map((question) => {
        const questionData: any = {
          id: question.id.toString(),
          text: question.text,
          type: question.type || "choix multiples",
          explication: question.explication,
          points: question.points?.toString() || "1",
          astuce: question.astuce,
          quizId: id,
          mediaUrl: question.media_url || null,
        };

        // Default answers for all question types
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

      // Return formatted response matching Laravel structure
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
    } catch (error) {
      console.error("Error in getQuizDetails:", error);
      throw new Error(`Failed to get quiz details: ${error.message}`);
    }
  }

  async getQuizJsonLd(id: number) {
    // This is used for the /api/quizzes/:id endpoint (JSON-LD Sparse format)
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ["questions", "formation"],
      });

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      return this.formatQuizJsonLd(quiz);
    } catch (error) {
      console.error("Error in getQuizJsonLd:", error);
      throw new Error(`Failed to get quiz JSON-LD: ${error.message}`);
    }
  }

  formatQuizJsonLd(quiz: Quiz) {
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

  formatQuestionJsonLd(question: Question) {
    return {
      "@id": `/api/questions/${question.id}`,
      "@type": "Question",
      id: question.id,
      text: question.text,
      type: question.type || "choix multiples",
      explication: question.explication,
      points: question.points?.toString() || "1",
      astuce: question.astuce,
      createdAt: question.created_at?.toISOString() || null,
      updatedAt: question.updated_at?.toISOString() || null,
      quiz: question.quiz_id
        ? `/api/quizzes/${question.quiz_id}`
        : question.quiz
          ? `/api/quizzes/${question.quiz.id}`
          : null,
      reponses: (question.reponses || []).map((r) => `/api/reponses/${r.id}`),
    };
  }

  formatReponseJsonLd(reponse: Reponse) {
    return {
      "@id": `/api/reponses/${reponse.id}`,
      "@type": "Reponse",
      id: reponse.id,
      text: reponse.text,
      isCorrect: reponse.isCorrect || false,
      position: reponse.position,
      flashcardBack: reponse.flashcardBack,
      match_pair: reponse.match_pair,
      bank_group: reponse.bank_group,
      question: reponse.question_id
        ? `/api/questions/${reponse.question_id}`
        : reponse.question
          ? `/api/questions/${reponse.question.id}`
          : null,
      createdAt: reponse.created_at?.toISOString() || null,
      updatedAt: reponse.updated_at?.toISOString() || null,
    };
  }

  private getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Création: "#9392BE",
      Bureautique: "#3D9BE9",
      Développement: "#4CAF50",
      Marketing: "#FF9800",
      Management: "#F44336",
    };
    return colors[category] || "#888888";
  }

  private getCategoryIcon(category: string): string {
    return "file-text"; // Can be customized per category
  }

  private getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      Bureautique: "Maîtrisez les outils de bureautique essentiels",
      Création:
        "Formation complète sur Adobe Illustrator pour la création vectorielle",
      Internet: "Création et gestion de sites web avec WordPress",
      Langues: "Apprentissage du français avec méthode interactive",
      IA: "Créez des contenus rédactionnels et visuels à l'aide de l'intelligence artificielle générative",
    };
    return (
      descriptions[category] ||
      `Explorez les quizzes de la catégorie ${category}`
    );
  }

  async getCategories(userId: number) {
    // Get stagiaire from user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["stagiaire"],
    });

    if (!user?.stagiaire) {
      throw new NotFoundException("Aucun stagiaire associé à cet utilisateur");
    }

    const stagiaireId = user.stagiaire.id;

    // Get quizzes for stagiaire's enrolled formations (matching Laravel logic)
    const quizzes = await this.quizRepository
      .createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.formation", "formation")
      .innerJoin("formation.catalogue_formations", "catalogue")
      .innerJoin(
        "catalogue.stagiaire_catalogue_formations",
        "scf",
        "scf.stagiaire_id = :stagiaireId",
        { stagiaireId }
      )
      .distinct(true)
      .getMany();

    // Group by category and count quizzes
    const categoriesMap: Map<string, any> = new Map();

    quizzes.forEach((quiz) => {
      const categoryName = quiz.formation?.categorie || "Non catégorisé";

      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, {
          id: categoryName,
          name: categoryName,
          color: this.getCategoryColor(categoryName),
          icon: this.getCategoryIcon(categoryName),
          description: this.getCategoryDescription(categoryName),
          quizCount: 0,
          colorClass: `category-${categoryName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")}
            .replace(/\s+/g, "-")`,
        });
      }

      const category = categoriesMap.get(categoryName);
      category.quizCount += 1;
    });

    return Array.from(categoriesMap.values());
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

  private async isAnswerCorrect(
    question: Question,
    selectedAnswers: any
  ): Promise<any> {
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

        // Fetch correct pairs from DB (Parity)
        const dbCorrectPairs = await this.correspondancePairRepository.find({
          where: { question_id: question.id },
        });

        const correctPairs: Record<string, string> = {};

        if (dbCorrectPairs.length > 0) {
          dbCorrectPairs.forEach((pair) => {
            correctPairs[pair.left_text] = pair.right_text;
          });
        } else {
          // Fallback
          question.reponses.forEach((r) => {
            if (r.match_pair) {
              correctPairs[r.text] = r.match_pair;
            }
          });
        }

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
      quiz_id: quizId,
      status: "completed",
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

      const result = await this.isAnswerCorrect(question, userAnswer);

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
    const totalQuestions = questionsDetails.length;

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
      classement.updated_at = new Date();
      await this.classementRepository.save(classement);
    }

    // 4. Create Progression (History)
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
      pourcentage:
        totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
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

  async getLatestParticipation(quizId: number, userId: number) {
    // Get the latest quiz participation with all related data
    const participation = await this.participationRepository.findOne({
      where: { quiz_id: quizId, user_id: userId },
      order: { completed_at: "DESC" },
      relations: [
        "quiz",
        "quiz.formation",
        "quiz.questions",
        "quiz.questions.reponses",
      ],
    });

    if (!participation) {
      return null;
    }

    // Get all user answers for this participation
    const userAnswers = await this.participationAnswerRepository.find({
      where: { participation_id: participation.id },
      relations: ["question"],
    });

    // Build questions details with user answers
    const questionsDetails = participation.quiz.questions.map((question) => {
      const userAnswer = userAnswers.find((a) => a.question_id === question.id);
      let selectedAnswers = null;
      let correctAnswers: any[] = [];
      let isCorrect = false;

      if (userAnswer) {
        selectedAnswers = userAnswer.answer_ids;

        // Determine correct answers based on question type
        correctAnswers = question.reponses
          .filter((r) => r.isCorrect)
          .map((r) => r.id);

        // Check if answer is correct
        if (Array.isArray(selectedAnswers)) {
          isCorrect =
            selectedAnswers.length === correctAnswers.length &&
            selectedAnswers.every((id: number) => correctAnswers.includes(id));
        }
      }

      return {
        id: question.id,
        text: question.text,
        type: question.type,
        selectedAnswers,
        correctAnswers,
        isCorrect,
        answers: question.reponses.map((r) => ({
          id: r.id,
          text: r.text,
          isCorrect: r.isCorrect,
        })),
      };
    });

    // Return formatted result with properly serialized dates
    return {
      success: true,
      quizId: participation.quiz_id,
      score: participation.score || 0,
      correctAnswers: participation.correct_answers || 0,
      totalQuestions: questionsDetails.length,
      timeSpent: participation.time_spent || 0,
      // Ensure dates are ISO strings or null
      startedAt: participation.started_at
        ? participation.started_at.toISOString()
        : null,
      completedAt: participation.completed_at
        ? participation.completed_at.toISOString()
        : null,
      questions: questionsDetails,
      quiz: {
        id: participation.quiz.id,
        titre: participation.quiz.titre,
        description: participation.quiz.description,
        formation: participation.quiz.formation
          ? {
              id: participation.quiz.formation.id,
              titre: participation.quiz.formation.titre,
              categorie: participation.quiz.formation.categorie,
            }
          : null,
      },
    };
  }
}
