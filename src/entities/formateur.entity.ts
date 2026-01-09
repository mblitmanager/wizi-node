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
import { Stagiaire } from "./stagiaire.entity";
import { CatalogueFormation } from "./catalogue-formation.entity";

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
  telephone: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.formateurs)
  @JoinTable({
    name: "formateur_stagiaire",
    joinColumn: { name: "formateur_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "stagiaire_id", referencedColumnName: "id" },
  })
  stagiaires: Stagiaire[];

  @ManyToMany(() => CatalogueFormation)
  @JoinTable({
    name: "formateur_catalogue_formation",
    joinColumn: { name: "formateur_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "catalogue_formation_id",
      referencedColumnName: "id",
    },
  })
  formations: CatalogueFormation[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
