import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";

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
    private classementRepository: Repository<Classement>
  ) {}

  async getAllQuizzes() {
    return this.quizRepository.find({ relations: ["formation"] });
  }

  async getQuizDetails(id: number) {
    return this.quizRepository.findOne({
      where: { id },
      relations: ["formation"],
    });
  }

  async getQuestionsByQuiz(quizId: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
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
      };

      // Default answers for all question types
      questionData.answers = question.reponses
        .map((reponse) => ({
          id: reponse.id.toString(),
          text: reponse.text,
          isCorrect: reponse.is_correct === 1 || reponse.is_correct === true,
        }))
        .sort((a, b) => a.id.localeCompare(b.id));

      // Type-specific formatting
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
            isCorrect:
              reponse.is_correct === 1 || reponse.is_correct === true,
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
          questionData.audioUrl = question.audio_url || question.media_url || null;
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
}
