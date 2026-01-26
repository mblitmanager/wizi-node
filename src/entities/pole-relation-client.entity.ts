import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./user.entity";
import { Stagiaire } from "./stagiaire.entity";

@Entity("pole_relation_clients")
export class PoleRelationClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  role: string;

  // stagiaire_id removed: It is M2M, not a column on this table

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.poleRelationClients)
  stagiaires: Stagiaire[];

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  civilite: string;

  @Column({ nullable: true })
  telephone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
