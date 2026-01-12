import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";

@Entity("agendas")
export class Agenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: true })
  date_debut: Date;

  @Column({ type: "timestamp", nullable: true })
  date_fin: Date;

  @Column({ nullable: true })
  evenement: string;

  @Column({ type: "text", nullable: true })
  commentaire: string;

  @Column()
  stagiaire_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Stagiaire, (stagiaire) => stagiaire.agendas)
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;
}
