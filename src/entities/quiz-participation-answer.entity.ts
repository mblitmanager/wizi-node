import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { QuizParticipation } from "./quiz-participation.entity";
import { Question } from "./question.entity";

@Entity("quiz_participation_answers")
export class QuizParticipationAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participation_id: number;

  @ManyToOne(() => QuizParticipation, (p: any) => p.answers)
  @JoinColumn({ name: "participation_id" })
  participation: QuizParticipation;

  @Column()
  question_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: "question_id" })
  question: Question;

  @Column({ type: "json" })
  answer_ids: any; // Stored as JSON array in Laravel

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
