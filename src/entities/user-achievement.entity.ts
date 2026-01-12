import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stagiaire } from "./stagiaire.entity";
import { Achievement } from "./achievement.entity";

@Entity("user_achievements")
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number; // Stagiaire ID/User ID based on Laravel logic? Laravel says belongsTo Stagiaire, usually via stagiaire_id, but schema has user_id. Stagiaire model has user_id FK to Users.
  // Laravel UserAchievement fillable has 'user_id'. Relation 'stagiaire' belongsTo Stagiaire.
  // If user_id points to `users` table, then Stagiaire relation is indirect?
  // Wait, in Laravel Stagiaire::achievements() likely uses 'user_id' if Stagiaire doesn't have its own ID in this table.
  // Let's assume user_id maps to Stagiaire's linked USER ID or commonly Stagiaire ID if messy.
  // HOWEVER, code `stagiaire->achievements()` works.
  // Let's implement generic user_id for now and link to Stagiaire if needed or User.
  // Given `return $this->belongsTo(Stagiaire::class);` and default FK is `stagiaire_id`, BUT fillable has `user_id`.
  // It's likely `belongsTo(Stagiaire::class, 'user_id', 'user_id')` or 'user_id', 'id'.
  // We'll stick to `user_id` column.

  @Column()
  achievement_id: number;

  @Column({ type: "timestamp", nullable: true })
  unlocked_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Stagiaire)
  @JoinColumn({ name: "user_id", referencedColumnName: "user_id" }) // Assuming user_id links to Stagiaire.user_id
  stagiaire: Stagiaire;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: "achievement_id" })
  achievement: Achievement;
}
