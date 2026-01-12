import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";
import { Formation } from "./formation.entity";

@Entity("progressions")
export class Progression {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  termine: boolean;

  @Column()
  stagiaire_id: number;

  @ManyToOne(() => Stagiaire)
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;

  @Column({ nullable: true })
  quiz_id: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ nullable: true })
  formation_id: number;

  @ManyToOne(() => Formation)
  @JoinColumn({ name: "formation_id" })
  formation: Formation;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  pourcentage: number;

  @Column({ type: "text", nullable: true })
  explication: string;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  completed_challenges: number;

  @Column({ default: 0 })
  correct_answers: number;

  @Column({ default: 0 })
  total_questions: number;

  @Column({ nullable: true })
  time_spent: number;

  @Column({ type: "timestamp", nullable: true })
  completion_time: Date;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
