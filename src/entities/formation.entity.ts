import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("formations")
export class Formation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;
}
