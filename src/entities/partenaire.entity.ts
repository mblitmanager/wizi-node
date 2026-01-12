import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";

@Entity("partenaires")
export class Partenaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  identifiant: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  ville: string;

  @Column({ nullable: true })
  departement: string;

  @Column({ nullable: true })
  code_postal: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: "json", nullable: true })
  contacts: any;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.partenaires)
  stagiaires: Stagiaire[];
}
