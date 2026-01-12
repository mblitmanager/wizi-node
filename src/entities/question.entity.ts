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

  @Column({ name: "text", type: "text" })
  text: string;

  @Column({
    type: "enum",
    enum: [
      "question audio",
      "remplir le champ vide",
      "carte flash",
      "correspondance",
      "choix multiples",
      "rearrangement",
      "vrai/faux",
      "banque de mots",
    ],
  })
  type: string;

  @Column({ nullable: true })
  explication: string;

  @Column({ nullable: true })
  points: string;

  @Column({ nullable: true })
  astuce: string;

  @Column({ name: "flashcard_back", type: "text", nullable: true })
  flashcard_back: string;

  @Column({ nullable: true })
  audio_url: string;

  @Column({ nullable: true })
  media_url: string;

  @Column({ nullable: true })
  quiz_id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @OneToMany(() => Reponse, (reponse) => reponse.question)
  reponses: Reponse[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
