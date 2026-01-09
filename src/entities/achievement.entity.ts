import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { Quiz } from "./quiz.entity";

@Entity("achievements")
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: "text", nullable: true })
  condition: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true }) // bronze, silver, gold, etc.
  level: string;

  @Column({ nullable: true })
  quiz_id: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ unique: true, nullable: true })
  code: string;

  @ManyToMany(() => Stagiaire, (stagiaire) => stagiaire.achievements)
  stagiaires: Stagiaire[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
