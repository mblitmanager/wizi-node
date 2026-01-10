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

  @Column({ name: "text", type: "text", nullable: true })
  text: string;

  @Column({ name: "is_correct", default: false, nullable: true })
  isCorrect: boolean;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  match_pair: string;

  @Column({ nullable: true })
  bank_group: string;

  @Column({ name: "flashcard_back", type: "text", nullable: true })
  flashcardBack: string;

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
