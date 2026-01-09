import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "timestamp", nullable: true })
  last_login_at: Date;

  @Column({ type: "timestamp", nullable: true })
  last_activity_at: Date;

  @Column({ nullable: true })
  last_login_ip: string;

  @Column({ default: false })
  is_online: boolean;

  @Column({ nullable: true })
  fcm_token: string;

  @Column({ nullable: true })
  last_client: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;

  @OneToOne(() => Stagiaire, (stagiaire) => stagiaire.user)
  stagiaire: Stagiaire;
}
