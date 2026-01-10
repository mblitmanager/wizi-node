import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Media } from "./media.entity";
import { Progression } from "./progression.entity";
import { StagiaireCatalogueFormation } from "./stagiaire-catalogue-formation.entity";
// Removed to fix circular imports
// import { CatalogueFormation } from "./catalogue-formation.entity";
// import { Formateur } from "./formateur.entity";
import { Commercial } from "./commercial.entity";
import { PoleRelationClient } from "./pole-relation-client.entity";
import { Classement } from "./classement.entity";
import { Achievement } from "./achievement.entity";

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

  @OneToMany(() => StagiaireCatalogueFormation, (scf) => scf.stagiaire)
  stagiaire_catalogue_formations: StagiaireCatalogueFormation[];

  @ManyToMany(() => Media, (media) => media.stagiaires)
  @JoinTable({
    name: "media_stagiaire",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "media_id", referencedColumnName: "id" },
  })
  medias: Media[];

  @OneToMany(() => Progression, (progression) => progression.stagiaire)
  progressions: Progression[];

  @ManyToMany("Formateur", (formateur: any) => formateur.stagiaires)
  @JoinTable({
    name: "formateur_stagiaire",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "formateur_id", referencedColumnName: "id" },
  })
  formateurs: any[];

  @ManyToMany(() => Commercial, (commercial) => commercial.stagiaires)
  @JoinTable({
    name: "commercial_stagiaire",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "commercial_id", referencedColumnName: "id" },
  })
  commercials: Commercial[];

  @ManyToMany(() => PoleRelationClient, (pole) => pole.stagiaires)
  @JoinTable({
    name: "pole_relation_client_stagiaire",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "pole_relation_client_id",
      referencedColumnName: "id",
    },
  })
  poleRelationClients: PoleRelationClient[];

  @OneToMany(() => Classement, (classement) => classement.stagiaire)
  classements: Classement[];

  @ManyToMany(() => Achievement, (achievement) => achievement.stagiaires)
  @JoinTable({
    name: "stagiaire_achievements",
    joinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "achievement_id", referencedColumnName: "id" },
  })
  achievements: Achievement[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
