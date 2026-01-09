import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";

@Entity("demande_inscriptions")
export class DemandeInscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parrain_id: number;

  @Column()
  filleul_id: number;

  @Column({ nullable: true })
  formation_id: number;

  @Column({ default: "en_attente" })
  statut: string;

  @Column({ type: "text", nullable: true })
  donnees_formulaire: string;

  @Column({ nullable: true })
  lien_parrainage: string;

  @Column({ nullable: true })
  motif: string;

  @Column({ type: "timestamp", nullable: true })
  date_demande: Date;

  @Column({ type: "timestamp", nullable: true })
  date_inscription: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "parrain_id" })
  parrain: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "filleul_id" })
  filleul: User;

  @ManyToOne(() => CatalogueFormation)
  @JoinColumn({ name: "formation_id" })
  formation: CatalogueFormation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
