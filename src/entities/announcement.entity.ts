import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("announcements")
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ default: "all" })
  target_audience: string; // 'all', 'stagiaires', 'formateurs', 'autres', 'specific_users'

  @Column({ type: "json", nullable: true })
  recipient_ids: number[];

  @Column({ type: "timestamp", nullable: true })
  scheduled_at: Date;

  @Column({ type: "timestamp", nullable: true })
  sent_at: Date;

  @Column({ default: "sent" })
  status: string;

  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;
}
