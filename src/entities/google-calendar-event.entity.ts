import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from "typeorm";
import { GoogleCalendar } from "./google-calendar.entity";

@Entity("google_calendar_events")
@Index(["google_id", "google_calendar_id"], { unique: true })
export class GoogleCalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    nullable: false,
  })
  google_calendar_id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  google_id: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  summary: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  location: string;

  @Column({
    type: "timestamp",
    nullable: false,
  })
  start: Date;

  @Column({
    type: "timestamp",
    nullable: false,
  })
  end: Date;

  @Column({
    name: "html_link",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  htmlLink: string;

  @Column({
    name: "hangout_link",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  hangoutLink: string;

  @Column({
    type: "json",
    nullable: true,
  })
  organizer: object;

  @Column({
    type: "json",
    nullable: true,
  })
  attendees: object[];

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  status: string;

  @Column({
    type: "json",
    nullable: true,
  })
  recurrence: object;

  @Column({
    name: "event_type",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  eventType: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => GoogleCalendar, (googleCalendar) => googleCalendar.events)
  @JoinColumn({ name: "google_calendar_id" })
  googleCalendar: GoogleCalendar;
}
