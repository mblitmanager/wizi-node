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

  @Column({ nullable: true })
  parrain_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "parrain_id" })
  parrain: User;

  @Column()
  filleul_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "filleul_id" })
  filleul: User;

  @Column()
  formation_id: number;

  @ManyToOne(() => CatalogueFormation)
  @JoinColumn({ name: "formation_id" })
  formation: CatalogueFormation;

  @Column({ default: "en_attente" })
  statut: string;

  @Column({ type: "json", nullable: true })
  donnees_formulaire: any;

  @Column({ nullable: true })
  lien_parrainage: string;

  @Column({ nullable: true })
  motif: string;

  @Column({ type: "timestamp", nullable: true })
  date_demande: Date;

  @Column({ type: "timestamp", nullable: true })
  date_inscription: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
