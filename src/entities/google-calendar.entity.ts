import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from './user.entity';
import { GoogleCalendarEvent } from './google-calendar-event.entity';

@Entity('google_calendars')
@Index(['googleId', 'userId'], { unique: true })
export class GoogleCalendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'google_id',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  googleId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  summary: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'background_color',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  backgroundColor: string;

  @Column({
    name: 'foreground_color',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  foregroundColor: string;

  @Column({
    name: 'access_role',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  accessRole: string;

  @Column({
    name: 'time_zone',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  timeZone: string;

  @Column({
    name: 'synced_at',
    type: 'timestamp',
    nullable: true,
  })
  syncedAt: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.googleCalendars)
  user: User;

  @OneToMany(() => GoogleCalendarEvent, event => event.googleCalendar)
  events: GoogleCalendarEvent[];
}
