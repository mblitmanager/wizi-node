import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("formateurs")
export class Formateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  civilite: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at: Date;

  @ManyToMany("Stagiaire", (stagiaire: any) => stagiaire.formateurs)
  @JoinTable({
    name: "formateur_stagiaire",
    joinColumn: { name: "formateur_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
  })
  stagiaires: any[];

  @ManyToMany("CatalogueFormation", (catalogue: any) => catalogue.formateurs)
  @JoinTable({
    name: "formateur_catalogue_formation",
    joinColumn: { name: "formateur_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "catalogue_formation_id",
      referencedColumnName: "id",
    },
  })
  formations: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
