import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Media } from "../entities/media.entity";
import { Parrainage } from "../entities/parrainage.entity";

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(StagiaireAchievement)
    private stagiaireAchievementRepository: Repository<StagiaireAchievement>,
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(MediaStagiaire)
    private mediaStagiaireRepository: Repository<MediaStagiaire>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(Parrainage)
    private parrainageRepository: Repository<Parrainage>
  ) {}

  async getAchievements(stagiaireId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: ["achievements"],
    });
    return stagiaire?.achievements || [];
  }

  async getAllAchievements() {
    return this.achievementRepository.find({
      relations: ["quiz"],
    });
  }

  async unlockAchievementByCode(stagiaireId: number, code: string) {
    const achievement = await this.achievementRepository.findOne({
      where: { code },
    });

    if (!achievement) return [];

    // Check if already unlocked using StagiaireAchievement pivot
    const existing = await this.stagiaireAchievementRepository.findOne({
      where: { stagiaire_id: stagiaireId, achievement_id: achievement.id },
    });

    if (existing) return [];

    // Unlock
    const newUnlock = this.stagiaireAchievementRepository.create({
      stagiaire_id: stagiaireId,
      achievement_id: achievement.id,
      unlocked_at: new Date(),
    });
    await this.stagiaireAchievementRepository.save(newUnlock);

    return [achievement];
  }

  async checkAchievements(stagiaireId: number, quizId?: number) {
    const newAchievements: Achievement[] = [];
    const now = new Date();

    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: ["achievements"],
    });
    if (!stagiaire) return [];

    // 1. Daily Login Streak Logic
    let streak = stagiaire.login_streak || 0;
    const lastLogin = stagiaire.last_login_at;

    if (lastLogin) {
      if (this.isToday(lastLogin)) {
        // Already logged in today, streak stays the same
      } else if (this.isYesterday(lastLogin)) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    // Update Stagiaire streak and last login
    stagiaire.login_streak = streak;
    stagiaire.last_login_at = now;
    await this.stagiaireRepository.save(stagiaire);

    // 2. Points (Sum score from Progressions)
    const { totalPoints } = await this.progressionRepository
      .createQueryBuilder("progression")
      .select("SUM(progression.score)", "totalPoints")
      .where("progression.stagiaire_id = :id", { id: stagiaireId })
      .getRawOne();

    const currentPoints = parseInt(totalPoints || "0");

    // 3. Quiz Stats
    const quizStats = await this.getQuizStats(stagiaireId);

    // 4. Video Stats
    const videoStats = await this.getVideoStats(stagiaireId);

    // 5. Referral Stats (based on User ID)
    const totalReferrals = await this.parrainageRepository.count({
      where: { parrain_id: stagiaire.user_id },
    });

    const achievements = await this.achievementRepository.find();
    const alreadyUnlockedIds = stagiaire.achievements.map((a) => a.id);

    for (const achievement of achievements) {
      let unlocked = false;
      const conditionValue = parseInt(achievement.condition || "0");

      switch (achievement.type) {
        case "connexion_serie":
          if (streak >= conditionValue) unlocked = true;
          break;
        case "points":
          if (currentPoints >= conditionValue) unlocked = true;
          break;
        case "quiz":
          if (conditionValue == 1 && quizStats.total_quizzes >= 1)
            unlocked = true;
          break;
        case "quiz_level":
          if (quizId && conditionValue == 1) {
            const quiz = await this.quizRepository.findOne({
              where: { id: quizId },
            });
            if (quiz && quiz.niveau === achievement.level) unlocked = true;
          }
          break;
        case "quiz_all":
          if (
            quizStats.total_quizzes >= quizStats.available_quizzes &&
            quizStats.available_quizzes > 0
          )
            unlocked = true;
          break;
        case "quiz_all_level":
          const levelMapping: Record<string, string> = {
            débutant: "beginner",
            intermédiaire: "intermediate",
            avancé: "advanced",
          };
          const levelKey =
            levelMapping[achievement.level?.toLowerCase() || ""] ||
            achievement.level;
          if (
            quizStats.quizzes_by_level[levelKey] &&
            quizStats.available_by_level[levelKey] &&
            quizStats.quizzes_by_level[levelKey] >=
              quizStats.available_by_level[levelKey]
          ) {
            unlocked = true;
          }
          break;
        case "video":
          if (conditionValue == 1 && videoStats.total_videos >= 1)
            unlocked = true;
          else if (
            conditionValue == 0 &&
            videoStats.total_videos >= videoStats.available_videos &&
            videoStats.available_videos > 0
          )
            unlocked = true;
          break;
        case "parrainage":
          if (totalReferrals >= conditionValue) unlocked = true;
          break;
        case "action":
          break;
      }

      if (unlocked && !alreadyUnlockedIds.includes(achievement.id)) {
        const unlockRecord = this.stagiaireAchievementRepository.create({
          stagiaire_id: stagiaireId,
          achievement_id: achievement.id,
          unlocked_at: now,
        });
        await this.stagiaireAchievementRepository.save(unlockRecord);
        newAchievements.push(achievement);
        alreadyUnlockedIds.push(achievement.id);
      }
    }

    return newAchievements;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  private isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }

  private async getQuizStats(stagiaireId: number) {
    const progressions = await this.progressionRepository.find({
      where: { stagiaire_id: stagiaireId },
      relations: ["quiz"],
    });

    const totalQuizzes = progressions.length;

    const quizzesByLevel = {
      beginner: progressions.filter(
        (p) => p.quiz?.niveau?.toLowerCase() === "débutant"
      ).length,
      intermediate: progressions.filter(
        (p) => p.quiz?.niveau?.toLowerCase() === "intermédiaire"
      ).length,
      advanced: progressions.filter(
        (p) => p.quiz?.niveau?.toLowerCase() === "avancé"
      ).length,
    };

    const availableQuizzes = await this.quizRepository.count();
    const availableByLevel = {
      beginner: await this.quizRepository.count({
        where: { niveau: "débutant" },
      }),
      intermediate: await this.quizRepository.count({
        where: { niveau: "intermédiaire" },
      }),
      advanced: await this.quizRepository.count({
        where: { niveau: "avancé" },
      }),
    };

    return {
      total_quizzes: totalQuizzes,
      quizzes_by_level: quizzesByLevel,
      available_quizzes: availableQuizzes,
      available_by_level: availableByLevel,
    };
  }

  private async getVideoStats(stagiaireId: number) {
    const watchedVideos = await this.mediaStagiaireRepository.count({
      where: { stagiaire_id: stagiaireId, is_watched: true },
    });
    const availableVideos = await this.mediaRepository.count();

    return {
      total_videos: watchedVideos,
      available_videos: availableVideos,
    };
  }
}
