import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Quiz } from "./quiz.entity";
import { QuizParticipationAnswer } from "./quiz-participation-answer.entity";

@Entity("quiz_participations")
export class QuizParticipation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  quiz_id: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ nullable: true })
  status: string;

  @Column({ type: "timestamp", nullable: true })
  started_at: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  correct_answers: number;

  @Column({ default: 0 })
  time_spent: number;

  @Column({ nullable: true })
  current_question_id: number;

  @OneToMany(
    () => QuizParticipationAnswer,
    (answer: any) => answer.participation
  )
  answers: QuizParticipationAnswer[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
