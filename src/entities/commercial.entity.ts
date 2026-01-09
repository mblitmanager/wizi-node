import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Stagiaire } from "./stagiaire.entity";

@Entity("commerciaux")
export class Commercial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  role: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  civilite: string;

  @Column({ nullable: true })
  telephone: string;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.commercials)
  stagiaires: Stagiaire[];

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
