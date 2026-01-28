import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Media } from "./media.entity";
import { Stagiaire } from "./stagiaire.entity";

@Entity("media_stagiaire")
export class MediaStagiaire {
  @PrimaryColumn()
  media_id: number;

  @PrimaryColumn()
  stagiaire_id: number;

  @Column({ default: false })
  is_watched: boolean;

  @Column({ type: "timestamp", nullable: true })
  watched_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "int", default: 0, select: false })
  current_time: number;

  @Column({ type: "int", default: 0, select: false })
  duration: number;

  percentage?: number;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Media)
  @JoinColumn({ name: "media_id" })
  media: Media;

  @ManyToOne(() => Stagiaire)
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;
}
