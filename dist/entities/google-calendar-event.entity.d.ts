import { GoogleCalendar } from "./google-calendar.entity";
export declare class GoogleCalendarEvent {
    id: number;
    google_calendar_id: number;
    google_id: string;
    summary: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
    htmlLink: string;
    hangoutLink: string;
    organizer: object;
    attendees: object[];
    status: string;
    recurrence: object;
    eventType: string;
    createdAt: Date;
    updatedAt: Date;
    googleCalendar: GoogleCalendar;
}
