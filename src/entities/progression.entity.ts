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
import { Quiz } from "./quiz.entity";
import { Formation } from "./formation.entity";

@Entity("progressions")
export class Progression {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  termine: boolean;

  @Column({ nullable: true })
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

  @Column({ type: "float", default: 0 })
  pourcentage: number;

  @Column({ type: "text", nullable: true })
  explication: string;

  @Column({ type: "int", default: 0 })
  score: number;

  @Column({ type: "int", default: 0 })
  correct_answers: number;

  @Column({ type: "int", default: 0 })
  total_questions: number;

  @Column({ nullable: true })
  time_spent: string;

  @Column({ type: "datetime", nullable: true })
  completion_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
