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

  @Column({ nullable: true })
  stagiaire_id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => Stagiaire)
  @JoinTable({
    name: "pole_relation_client_stagiaire",
    joinColumn: { name: "pole_relation_client_id" },
    inverseJoinColumn: { name: "stagiaire_id" },
  })
  stagiaires: Stagiaire[];

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  telephone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
