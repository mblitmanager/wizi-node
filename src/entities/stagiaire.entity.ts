import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./user.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";

@Entity("stagiaires")
export class Stagiaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  civilite: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: "date", nullable: true })
  date_naissance: Date;

  @Column({ nullable: true })
  ville: string;

  @Column({ nullable: true })
  code_postal: string;

  @Column({ type: "date", nullable: true })
  date_debut_formation: Date;

  @Column({ type: "date", nullable: true })
  date_inscription: Date;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  statut: string;

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: "date", nullable: true })
  date_fin_formation: Date;

  @Column({ default: false })
  onboarding_seen: boolean;

  @Column({ nullable: true })
  partenaire_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => CatalogueFormation, (catalogue) => catalogue.stagiaires)
  @JoinTable({
    name: "stagiaire_catalogue_formations",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "catalogue_formation_id",
      referencedColumnName: "id",
    },
  })
  catalogue_formations: CatalogueFormation[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
