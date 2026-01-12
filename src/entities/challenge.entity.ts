import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("challenges")
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  titre: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  date_debut: string;

  @Column({ nullable: true })
  date_fin: string;

  @Column({ nullable: true })
  points: string;

  @Column()
  participation_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
