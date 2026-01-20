import { Stagiaire } from "./stagiaire.entity";
import { GoogleCalendar } from "./google-calendar.entity";
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    image: string;
    last_login_at: Date;
    last_activity_at: Date;
    last_login_ip: string;
    is_online: boolean;
    fcm_token: string;
    last_client: string;
    adresse: string;
    created_at: Date;
    updated_at: Date;
    stagiaire: Stagiaire;
    googleCalendars: GoogleCalendar[];
}
