import { User } from './user.entity';
import { GoogleCalendarEvent } from './google-calendar-event.entity';
export declare class GoogleCalendar {
    id: number;
    userId: number;
    googleId: string;
    summary: string;
    description: string;
    backgroundColor: string;
    foregroundColor: string;
    accessRole: string;
    timeZone: string;
    syncedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    events: GoogleCalendarEvent[];
}
