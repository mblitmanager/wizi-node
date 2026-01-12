import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from "typeorm";
import { StagiaireCatalogueFormation } from "./stagiaire-catalogue-formation.entity";
import { Formation } from "./formation.entity";

@Entity("catalogue_formations")
export class CatalogueFormation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: 1 })
  statut: number;

  @Column({ nullable: true })
  certification: string;

  @Column({ type: "text", nullable: true })
  prerequis: string;

  @Column({ nullable: true })
  duree: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  tarif: number;

  @Column({ nullable: true })
  formation_id: number;

  @ManyToOne(() => Formation, (formation) => formation.catalogue_formations)
  @JoinColumn({ name: "formation_id" })
  formation: Formation;

  @Column({ nullable: true })
  cursus_pdf: string;

  @Column({ type: "text", nullable: true })
  objectifs: string;

  @Column({ type: "text", nullable: true })
  programme: string;

  @Column({ type: "text", nullable: true })
  modalites: string;

  @Column({ type: "text", nullable: true })
  modalites_accompagnement: string;

  @Column({ type: "text", nullable: true })
  moyens_pedagogiques: string;

  @Column({ type: "text", nullable: true })
  modalites_suivi: string;

  @Column({ type: "text", nullable: true })
  evaluation: string;

  @Column({ nullable: true })
  lieu: string;

  @Column({ nullable: true })
  niveau: string;

  @Column({ nullable: true })
  public_cible: string;

  @Column({ nullable: true })
  nombre_participants: number;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;

  @OneToMany(
    () => StagiaireCatalogueFormation,
    (scf) => scf.catalogue_formation
  )
  stagiaire_catalogue_formations: StagiaireCatalogueFormation[];

  @ManyToMany("Formateur", (formateur: any) => formateur.formations)
  @JoinTable({
    name: "formateur_catalogue_formation",
    joinColumn: { name: "catalogue_formation_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "formateur_id", referencedColumnName: "id" },
  })
  formateurs: any[];
}
