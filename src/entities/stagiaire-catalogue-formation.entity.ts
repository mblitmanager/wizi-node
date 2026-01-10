import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";

@Entity("stagiaire_catalogue_formations")
export class StagiaireCatalogueFormation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "stagiaire_id" })
  stagiaire_id: number;

  @Column({ name: "catalogue_formation_id" })
  catalogue_formation_id: number;

  @Column({ type: "date", nullable: true })
  date_debut: Date;

  @Column({ type: "date", nullable: true })
  date_inscription: Date;

  @Column({ type: "date", nullable: true })
  date_fin: Date;

  @Column({ nullable: true })
  formateur_id: number;

  @ManyToOne(
    () => Stagiaire,
    (stagiaire) => stagiaire.stagiaire_catalogue_formations
  )
  @JoinColumn({ name: "stagiaire_id" })
  stagiaire: Stagiaire;

  @ManyToOne(
    () => CatalogueFormation,
    (catalogue) => catalogue.stagiaire_catalogue_formations
  )
  @JoinColumn({ name: "catalogue_formation_id" })
  catalogue_formation: CatalogueFormation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
