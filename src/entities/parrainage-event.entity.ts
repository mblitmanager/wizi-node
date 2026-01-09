import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("parrainage_events")
export class ParrainageEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  titre: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  prix: number;

  @Column({ type: "timestamp", nullable: true })
  date_debut: Date;

  @Column({ type: "timestamp", nullable: true })
  date_fin: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
