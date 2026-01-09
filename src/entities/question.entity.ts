import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Quiz } from "./quiz.entity";
import { Reponse } from "./reponse.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  question_text: string;

  @Column({ nullable: true })
  quiz_id: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @OneToMany(() => Reponse, (reponse) => reponse.question)
  reponses: Reponse[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
