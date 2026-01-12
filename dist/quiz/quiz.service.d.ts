import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { CorrespondancePair } from "../entities/correspondance-pair.entity";
import { Reponse } from "../entities/reponse.entity";
import { Progression } from "../entities/progression.entity";
export declare class QuizService {
    private quizRepository;
    private questionRepository;
    private formationRepository;
    private classementRepository;
    private participationRepository;
    private participationAnswerRepository;
    private correspondancePairRepository;
    private progressionRepository;
    constructor(quizRepository: Repository<Quiz>, questionRepository: Repository<Question>, formationRepository: Repository<Formation>, classementRepository: Repository<Classement>, participationRepository: Repository<QuizParticipation>, participationAnswerRepository: Repository<QuizParticipationAnswer>, correspondancePairRepository: Repository<CorrespondancePair>, progressionRepository: Repository<Progression>);
    getAllQuizzes(): Promise<Quiz[]>;
    getQuestionsByQuiz(quizId: number): Promise<{
        data: {
            id: number;
            quiz_id: number;
            text: string;
            type: string;
            explication: string;
            points: string;
            astuce: string;
            media_url: string;
            created_at: Date;
            updated_at: Date;
            reponses: {
                id: number;
                text: string;
                question_id: number;
                is_correct: number;
                position: number;
                match_pair: string;
                bank_group: string;
                flashcard_back: string;
                created_at: Date;
                updated_at: Date;
            }[];
        }[];
    }>;
    getQuizDetails(id: number): Promise<{
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
        questions: any[];
    }>;
    getQuizJsonLd(id: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    formatQuizJsonLd(quiz: Quiz): {
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    formatQuestionJsonLd(question: Question): {
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        texte: string;
        type: string;
        points: string;
        astuce: string;
        explication: string;
        audio_url: string;
        media_url: string;
        flashcard_back: string;
        quiz: string;
        reponses: string[];
        created_at: Date;
        updated_at: Date;
    };
    formatReponseJsonLd(reponse: Reponse): {
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        texte: string;
        correct: boolean;
        position: number;
        explanation: string;
        match_pair: string;
        bank_group: string;
        question: string;
        created_at: Date;
        updated_at: Date;
    };
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
    private isAnswerCorrect;
    submitQuizResult(quizId: number, userId: number, stagiaireId: number, answers: Record<string, any>, timeSpent: number): Promise<{
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
