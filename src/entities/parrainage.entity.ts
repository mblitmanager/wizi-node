import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("parrainages")
export class Parrainage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filleul_id: number;

  @Column()
  parrain_id: number;

  @Column({ type: "timestamp", nullable: true })
  date_parrainage: Date;

  @Column({ default: 0 })
  points: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  gains: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "filleul_id" })
  filleul: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "parrain_id" })
  parrain: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
