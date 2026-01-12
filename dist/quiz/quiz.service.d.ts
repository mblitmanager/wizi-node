import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
export declare class QuizService {
    private quizRepository;
    private questionRepository;
    private formationRepository;
    private classementRepository;
    constructor(quizRepository: Repository<Quiz>, questionRepository: Repository<Question>, formationRepository: Repository<Formation>, classementRepository: Repository<Classement>);
    getAllQuizzes(): Promise<Quiz[]>;
    getQuizDetails(id: number): Promise<Quiz>;
    getQuestionsByQuiz(quizId: number): Promise<{
        id: string;
        titre: string;
        description: string;
        categorie: string;
        categorieId: string;
        niveau: string;
        questions: any[];
        points: number;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        color: string;
        icon: string;
        description: string;
        quizCount: number;
        colorClass: string;
    }[]>;
    getHistoryByStagiaire(stagiaireId: number): Promise<Classement[]>;
    getStats(userId: number): Promise<{
        totalQuizzes: number;
        totalPoints: number;
        averageScore: number;
        categoryStats: any[];
        levelProgress: {
            débutant: {
                completed: number;
                averageScore: any;
            };
            intermédiaire: {
                completed: number;
                averageScore: any;
            };
            avancé: {
                completed: number;
                averageScore: any;
            };
        };
    }>;
    getStatsCategories(userId: number): Promise<any[]>;
    getStatsProgress(userId: number): Promise<Classement[]>;
    getStatsTrends(userId: number): Promise<any[]>;
    getStatsPerformance(userId: number): Promise<any[]>;
    getQuizzesByCategory(category: string, stagiaireId: number): Promise<{
        id: string;
        titre: string;
        description: string;
        categorie: string;
        categorieId: string;
        niveau: string;
        questionCount: number;
        questions: any[];
        points: number;
    }[]>;
    getQuizStatistics(quizId: number, stagiaireId: number): Promise<{
        total_attempts: number;
        average_score: number;
        best_score: number;
        last_attempt: {
            score: number;
            date: string;
            time_spent: number;
        };
        quiz: {
            id: number;
            title: string;
            total_questions: number;
            total_points: number;
        };
    }>;
    submitQuizResult(quizId: number, stagiaireId: number, answers: Record<string, any>, timeSpent: number): Promise<{
        success: boolean;
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        timeSpent: number;
        questions: any[];
        quiz: {
            id: number;
            titre: string;
            formation: {
                id: number;
                titre: string;
                categorie: string;
            };
        };
    }>;
}
