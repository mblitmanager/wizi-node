import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";

@Entity("catalogue_formations")
export class CatalogueFormation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.catalogue_formations)
  stagiaires: Stagiaire[];
}
