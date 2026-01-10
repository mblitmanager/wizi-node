import { Repository } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { User } from "../entities/user.entity";
export declare class RankingService {
    private classementRepository;
    private stagiaireRepository;
    private participationRepository;
    private progressionRepository;
    private quizRepository;
    private userRepository;
    constructor(classementRepository: Repository<Classement>, stagiaireRepository: Repository<Stagiaire>, participationRepository: Repository<QuizParticipation>, progressionRepository: Repository<Progression>, quizRepository: Repository<Quiz>, userRepository: Repository<User>);
    getGlobalRanking(): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }[]>;
    getMyRanking(userId: number): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            image: any;
        };
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    }>;
    getFormationRanking(formationId: number): Promise<{
        id: number;
        name: string;
        points: number;
        rang: number;
    }[]>;
    getStagiaireProgress(userId: number): Promise<{
        stagiaire: {
            id: string;
            prenom: string;
            image: string;
        };
        totalPoints: any;
        quizCount: number;
        averageScore: number;
        completedQuizzes: number;
        totalTimeSpent: number;
        rang: number;
        level: number;
        categoryStats: {
            category: string;
            quizCount: number;
            averageScore: number;
        }[];
        levelProgress: {
            débutant: {
                completed: number;
                averageScore: number;
            };
            intermédiaire: {
                completed: number;
                averageScore: number;
            };
            avancé: {
                completed: number;
                averageScore: number;
            };
        };
    }>;
    getStagiaireRewards(stagiaireId: number): Promise<{
        points: number;
        completed_quizzes: number;
        completed_challenges: number;
    }>;
    getStagiaireDetails(stagiaireId: number): Promise<{
        id: number;
        firstname: string;
        name: string;
        avatar: string;
        rang: number;
        totalPoints: number;
        formations: {
            id: number;
            titre: string;
        }[];
        formateurs: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        }[];
        quizStats: {
            totalCompleted: number;
            totalQuiz: number;
            pourcentageReussite: number;
            byLevel: {
                débutant: {
                    completed: number;
                    averageScore: number;
                };
                intermédiaire: {
                    completed: number;
                    averageScore: number;
                };
                avancé: {
                    completed: number;
                    averageScore: number;
                };
            };
            lastActivity: Date;
        };
    }>;
    getUserPoints(userId: number): Promise<{
        totalPoints: number;
        accessibleLevels: string[];
    }>;
    getQuizHistory(userId: number): Promise<{
        id: string;
        quizId: string;
        quiz: {
            titre: string;
            title: string;
            category: string;
            totalPoints: number;
            level: string;
            formation: import("../entities/formation.entity").Formation;
        };
        score: number;
        completedAt: Date;
        timeSpent: number;
        totalQuestions: number;
        correctAnswers: number;
    }[]>;
    getQuizStats(userId: number): Promise<{
        totalQuizzes: number;
        total_quizzes: number;
        averageScore: number;
        average_score: number;
        totalPoints: number;
        total_points: number;
        categoryStats: {
            category: string;
            quizCount: number;
            averageScore: number;
        }[];
        category_stats: {
            category: string;
            quizCount: number;
            averageScore: number;
        }[];
        levelProgress: {
            débutant: {
                completed: number;
                averageScore: number;
            };
            intermédiaire: {
                completed: number;
                averageScore: number;
            };
            avancé: {
                completed: number;
                averageScore: number;
            };
        };
        level_progress: {
            débutant: {
                completed: number;
                averageScore: number;
            };
            intermédiaire: {
                completed: number;
                averageScore: number;
            };
            avancé: {
                completed: number;
                averageScore: number;
            };
        };
    }>;
    getCategoryStats(userId: number): Promise<{
        completedQuizzes: number;
        totalQuizzes: number;
        completionRate: number;
        category: string;
        quizCount: number;
        averageScore: number;
    }[]>;
    getProgressStats(userId: number): Promise<{
        daily_progress: any[];
        weekly_progress: any[];
        monthly_progress: any[];
    }>;
    calculateLevel(points: number): string;
    private groupBy;
}
