import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Formation } from "./formation.entity";
import { Question } from "./question.entity";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  niveau: string;

  @Column({ nullable: true })
  duree: string;

  @Column({ nullable: true })
  nb_points_total: string;

  @Column({
    type: "enum",
    enum: ["actif", "inactif"],
    default: "actif",
  })
  status: string;

  @Column({ nullable: true })
  formation_id: number;

  @ManyToOne(() => Formation, (formation) => formation.quizzes)
  @JoinColumn({ name: "formation_id" })
  formation: Formation;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
