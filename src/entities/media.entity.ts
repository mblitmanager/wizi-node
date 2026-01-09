import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { Formation } from "./formation.entity";
import { Stagiaire } from "./stagiaire.entity";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  categorie: string;

  @Column({ nullable: true })
  titre: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  formation_id: number;

  @ManyToOne(() => Formation)
  @JoinColumn({ name: "formation_id" })
  formation: Formation;

  @Column({ nullable: true })
  duree: string;

  @Column({ nullable: true })
  ordre: number;

  @Column({ nullable: true })
  video_platform: string;

  @Column({ nullable: true })
  video_file_path: string;

  @Column({ nullable: true })
  subtitle_file_path: string;

  @Column({ nullable: true })
  subtitle_language: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  mime: string;

  @Column({ nullable: true })
  uploaded_by: number;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.medias)
  stagiaires: Stagiaire[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
