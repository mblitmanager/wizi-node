import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Media } from "./media.entity";
import { Quiz } from "./quiz.entity";
import { Progression } from "./progression.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";

@Entity("formations")
export class Formation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  titre: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  categorie: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 1 })
  statut: number;

  @Column({ nullable: true })
  duree: string;

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

  @OneToMany(() => CatalogueFormation, (catalogue) => catalogue.formation)
  catalogue_formations: CatalogueFormation[];
}
