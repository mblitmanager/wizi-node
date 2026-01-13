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

@Entity("participations")
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: "date", nullable: true })
  date: string;

  @Column({ type: "time", nullable: true })
  heure: string;

  @Column({ type: "int", default: 0 })
  score: number;

  @Column({ default: false })
  deja_jouer: boolean;

  @Column({ nullable: true })
  current_question_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
