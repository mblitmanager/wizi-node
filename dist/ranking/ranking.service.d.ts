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
    findAllPaginated(page?: number, limit?: number): Promise<{
        items: Classement[];
        total: number;
    }>;
    getGlobalRanking(period?: string): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        };
        formateurs: any;
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
            nom: any;
            image: any;
        };
        formateurs: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    } | {
        stagiaire: {
            id: string;
            prenom: string;
            image: any;
        };
        totalPoints: number;
        quizCount: number;
        averageScore: number;
        rang: number;
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
            level: string;
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
        quiz: {
            id: number;
            titre: string;
            description: string;
            duree: string;
            niveau: string;
            status: string;
            nb_points_total: string;
            formation: {
                id: number;
                titre: string;
                description: string;
                duree: string;
                categorie: string;
            };
            questions: {
                id: string;
                quizId: number;
                text: string;
                type: string;
                explication: string;
                points: string;
                astuce: string;
                mediaUrl: string;
                answers: {
                    id: string;
                    text: string;
                    isCorrect: number;
                    position: number;
                    matchPair: string;
                    bankGroup: string;
                    flashcardBack: string;
                }[];
            }[];
        };
        score: number;
        completedAt: string;
        timeSpent: number;
        totalQuestions: number;
        correctAnswers: number;
    }[]>;
    getQuizStats(userId: number): Promise<{
        totalQuizzes: number;
        averageScore: number;
        totalPoints: number;
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
