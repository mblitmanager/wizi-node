import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../entities/challenge.entity";
import { Progression } from "../entities/progression.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(QuizParticipation)
    private participationRepository: Repository<QuizParticipation>
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.challengeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: "DESC" },
    });
    return { items, total };
  }

  async findOne(id: number): Promise<Challenge | null> {
    return this.challengeRepository.findOne({ where: { id } });
  }

  async create(data: any): Promise<Challenge> {
    const challenge = this.challengeRepository.create(data);
    return this.challengeRepository.save(challenge) as any;
  }

  async update(id: number, data: any): Promise<Challenge | null> {
    await this.challengeRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.challengeRepository.softDelete(id);
  }

  formatChallengeJsonLd(challenge: Challenge) {
    return {
      "@id": `/api/challenges/${challenge.id}`,
      "@type": "Challenge",
      id: challenge.id,
      titre: challenge.titre,
      description: challenge.description,
      date_debut: challenge.date_debut,
      date_fin: challenge.date_fin,
      points: challenge.points,
      participation_id: challenge.participation_id,
      createdAt: challenge.created_at?.toISOString().replace("Z", "+00:00"),
      updatedAt: challenge.updated_at?.toISOString().replace("Z", "+00:00"),
    };
  }

  async getChallengeConfig() {
    // Return active challenge configuration
    const activeChallenge = await this.challengeRepository.find({
      order: { created_at: "DESC" },
      take: 1,
    });

    return {
      active_challenge: activeChallenge[0] || null,
      config: {
        points_multiplier: 1.5,
        bonus_completion: 50,
      },
    };
  }

  async getLeaderboard() {
    // Return leaderboard based on completed_challenges or points from challenges
    // Using progressions table as seen in Laravel RankingRepository
    const rankings = await this.progressionRepository
      .createQueryBuilder("progression")
      .innerJoinAndSelect("progression.stagiaire", "stagiaire")
      .orderBy("progression.completed_challenges", "DESC")
      .addOrderBy("progression.points", "DESC")
      .limit(20)
      .getMany();

    return rankings.map((r, index) => ({
      rank: index + 1,
      stagiaire_id: r.stagiaire_id,
      name: r.stagiaire.prenom, // Simplified as we may not have user join here
      points: r.points,
      completed_challenges: r.completed_challenges,
    }));
  }

  async getChallengeEntries(userId: number) {
    // Return entries (participations that are challenges)
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });
    if (!stagiaire) return [];

    // Assuming challenges are linked to participations via participation_id in Challenge table
    // or vice-versa. Based on Challenge entity: participation_id is a column.
    const challenges = await this.challengeRepository.find({
      where: { participation_id: userId }, // This field mapping might need adjustment based on real data
    });

    return challenges;
  }
}
