import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Media } from "./media.entity";
import { Quiz } from "./quiz.entity";
import { Progression } from "./progression.entity";

@Entity("formations")
export class Formation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;

  @OneToMany(() => Media, (media) => media.formation)
  medias: Media[];

  @OneToMany(() => Quiz, (quiz) => quiz.formation)
  quizzes: Quiz[];

  @OneToMany(() => Progression, (progression) => progression.formation)
  progressions: Progression[];
}
