import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Formation } from "./formation.entity";

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

  @ManyToOne(() => Formation)
  @JoinColumn({ name: "formation_id" })
  formation: Formation;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
