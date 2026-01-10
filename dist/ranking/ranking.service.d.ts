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
        completedQuizzes: any;
        totalTimeSpent: number;
        rang: number;
        level: number;
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
                debutant: {
                    completed: number;
                    total: number;
                };
                intermediaire: {
                    completed: number;
                    total: number;
                };
                expert: {
                    completed: number;
                    total: number;
                };
            };
            lastActivity: Date;
        };
    }>;
    getUserPoints(userId: number): Promise<{
        totalPoints: number;
        accessibleLevels: string[];
    }>;
    calculateLevel(points: number): string;
    private groupBy;
}
