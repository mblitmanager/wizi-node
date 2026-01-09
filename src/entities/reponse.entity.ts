import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Entity("reponses")
export class Reponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  reponse_text: string;

  @Column({ default: false })
  is_correct: boolean;

  @Column({ nullable: true })
  question_id: number;

  @ManyToOne(() => Question, (question) => question.reponses)
  @JoinColumn({ name: "question_id" })
  question: Question;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
