import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { Achievement } from "./achievement.entity";

@Entity("stagiaire_achievements")
export class StagiaireAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stagiaire_id: number;

  @Column()
  achievement_id: number;

  @Column({ type: "timestamp", nullable: true })
  unlocked_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Stagiaire)
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: "achievement_id" })
  achievement: Achievement;
}
