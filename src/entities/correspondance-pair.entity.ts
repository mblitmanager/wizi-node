import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Entity("correspondance_pairs")
export class CorrespondancePair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_id: number;

  @Column({ type: "text" })
  left_text: string;

  @Column({ type: "text" })
  right_text: string;

  @Column({ nullable: true }) // Based on Laravel fillable
  left_id: number;

  @Column({ nullable: true }) // Based on Laravel fillable
  right_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Question)
  @JoinColumn({ name: "question_id" })
  question: Question;
}
