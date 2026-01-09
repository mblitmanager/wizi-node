import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";

@Entity("classements")
export class Classement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  rang: number;

  @Column()
  stagiaire_id: number;

  @ManyToOne(() => Stagiaire)
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;

  @Column()
  quiz_id: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ default: 0 })
  points: number;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
